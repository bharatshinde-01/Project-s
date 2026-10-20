import os
from datetime import date, datetime
from decimal import Decimal
from functools import wraps

import mysql.connector
from mysql.connector import Error
from flask import Flask, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "change-this-secret-key-before-deployment")

DB_CONFIG = {
    "host": os.environ.get("DB_HOST", "localhost"),
    "user": os.environ.get("DB_USER", "root"),
    "password": os.environ.get("DB_PASSWORD", ""),
    "database": os.environ.get("DB_NAME", "smart_shop_db"),
}

def get_db():
    return mysql.connector.connect(**DB_CONFIG)

def init_db():
    """Create tables and a first demo admin. The database itself must exist first."""
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(80) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(120) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS suppliers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(120) NOT NULL,
            phone VARCHAR(25),
            email VARCHAR(120),
            address VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(150) NOT NULL,
            sku VARCHAR(60) UNIQUE,
            category VARCHAR(100),
            supplier_id INT NULL,
            purchase_price DECIMAL(10,2) NOT NULL DEFAULT 0,
            selling_price DECIMAL(10,2) NOT NULL DEFAULT 0,
            quantity INT NOT NULL DEFAULT 0,
            min_quantity INT NOT NULL DEFAULT 5,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
        )
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS sales (
            id INT AUTO_INCREMENT PRIMARY KEY,
            invoice_no VARCHAR(40) NOT NULL UNIQUE,
            customer_name VARCHAR(120) DEFAULT 'Walk-in Customer',
            subtotal DECIMAL(10,2) NOT NULL,
            discount DECIMAL(10,2) NOT NULL DEFAULT 0,
            total DECIMAL(10,2) NOT NULL,
            payment_method VARCHAR(30) NOT NULL DEFAULT 'Cash',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS sale_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            sale_id INT NOT NULL,
            product_id INT NOT NULL,
            product_name VARCHAR(150) NOT NULL,
            quantity INT NOT NULL,
            unit_price DECIMAL(10,2) NOT NULL,
            unit_cost DECIMAL(10,2) NOT NULL,
            line_total DECIMAL(10,2) NOT NULL,
            FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    """)
    cur.execute("SELECT id FROM users WHERE username=%s", ("admin",))
    if not cur.fetchone():
        cur.execute(
            "INSERT INTO users (username, password_hash, full_name) VALUES (%s,%s,%s)",
            ("admin", generate_password_hash("admin123"), "Shop Administrator")
        )
    conn.commit()
    cur.close()
    conn.close()

def db_query(sql, params=(), one=False):
    conn = get_db()
    cur = conn.cursor(dictionary=True)
    cur.execute(sql, params)
    result = cur.fetchone() if one else cur.fetchall()
    cur.close()
    conn.close()
    return result

def login_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if "user_id" not in session:
            return redirect(url_for("login"))
        return fn(*args, **kwargs)
    return wrapper

@app.template_filter("money")
def money(value):
    try:
        return "₹{:,.2f}".format(float(value or 0))
    except (TypeError, ValueError):
        return "₹0.00"

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")
        user = db_query("SELECT * FROM users WHERE username=%s", (username,), one=True)
        if user and check_password_hash(user["password_hash"], password):
            session.clear()
            session["user_id"] = user["id"]
            session["username"] = user["username"]
            session["full_name"] = user["full_name"]
            return redirect(url_for("dashboard"))
        flash("Incorrect username or password.", "danger")
    return render_template("login.html")

@app.route("/logout")
def logout():
    session.clear()
    flash("You have been logged out.", "info")
    return redirect(url_for("login"))

@app.route("/")
@login_required
def dashboard():
    stats = db_query("""
        SELECT
          (SELECT COUNT(*) FROM products) AS product_count,
          (SELECT COALESCE(SUM(quantity),0) FROM products) AS stock_units,
          (SELECT COUNT(*) FROM products WHERE quantity <= min_quantity) AS low_stock,
          (SELECT COUNT(*) FROM sales WHERE DATE(created_at)=CURDATE()) AS sales_today,
          (SELECT COALESCE(SUM(total),0) FROM sales WHERE DATE(created_at)=CURDATE()) AS revenue_today,
          (SELECT COALESCE(SUM((si.unit_price-si.unit_cost)*si.quantity),0)
             FROM sale_items si JOIN sales s ON s.id=si.sale_id
             WHERE DATE(s.created_at)=CURDATE()) AS profit_today
    """, one=True)
    low_products = db_query("""
        SELECT p.*, s.name AS supplier_name FROM products p
        LEFT JOIN suppliers s ON p.supplier_id=s.id
        WHERE p.quantity <= p.min_quantity ORDER BY p.quantity ASC LIMIT 8
    """)
    recent_sales = db_query("SELECT * FROM sales ORDER BY created_at DESC LIMIT 6")
    return render_template("dashboard.html", stats=stats, low_products=low_products, recent_sales=recent_sales)

@app.route("/products", methods=["GET", "POST"])
@login_required
def products():
    if request.method == "POST":
        try:
            name = request.form.get("name", "").strip()
            sku = request.form.get("sku", "").strip() or None
            category = request.form.get("category", "").strip()
            supplier_id = request.form.get("supplier_id") or None
            purchase_price = Decimal(request.form.get("purchase_price", "0"))
            selling_price = Decimal(request.form.get("selling_price", "0"))
            quantity = int(request.form.get("quantity", "0"))
            min_quantity = int(request.form.get("min_quantity", "5"))
            if not name or purchase_price < 0 or selling_price < 0 or quantity < 0 or min_quantity < 0:
                raise ValueError("Please enter valid product details.")
            conn = get_db()
            cur = conn.cursor()
            cur.execute("""INSERT INTO products
                (name,sku,category,supplier_id,purchase_price,selling_price,quantity,min_quantity)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s)""",
                (name,sku,category,supplier_id,purchase_price,selling_price,quantity,min_quantity))
            conn.commit()
            cur.close(); conn.close()
            flash("Product added successfully.", "success")
            return redirect(url_for("products"))
        except (ValueError, Error) as exc:
            flash("Could not add product. Check the values and make sure SKU is unique. " + str(exc), "danger")
    q = request.args.get("q", "").strip()
    products_list = db_query("""SELECT p.*, s.name AS supplier_name FROM products p
        LEFT JOIN suppliers s ON p.supplier_id=s.id
        WHERE p.name LIKE %s OR COALESCE(p.sku,'') LIKE %s OR COALESCE(p.category,'') LIKE %s
        ORDER BY p.name""", (f"%{q}%",f"%{q}%",f"%{q}%"))
    suppliers_list = db_query("SELECT id,name FROM suppliers ORDER BY name")
    return render_template("products.html", products=products_list, suppliers=suppliers_list, q=q)

@app.route("/products/<int:product_id>/edit", methods=["GET", "POST"])
@login_required
def edit_product(product_id):
    product = db_query("SELECT * FROM products WHERE id=%s", (product_id,), one=True)
    if not product:
        flash("Product not found.", "warning")
        return redirect(url_for("products"))
    if request.method == "POST":
        try:
            values = (
                request.form.get("name","").strip(),
                request.form.get("sku","").strip() or None,
                request.form.get("category","").strip(),
                request.form.get("supplier_id") or None,
                Decimal(request.form.get("purchase_price","0")),
                Decimal(request.form.get("selling_price","0")),
                int(request.form.get("quantity","0")),
                int(request.form.get("min_quantity","5")),
                product_id
            )
            if not values[0] or min(values[4], values[5]) < 0 or min(values[6], values[7]) < 0:
                raise ValueError("Invalid values")
            conn=get_db(); cur=conn.cursor()
            cur.execute("""UPDATE products SET name=%s,sku=%s,category=%s,supplier_id=%s,
                purchase_price=%s,selling_price=%s,quantity=%s,min_quantity=%s WHERE id=%s""", values)
            conn.commit(); cur.close(); conn.close()
            flash("Product updated.", "success")
            return redirect(url_for("products"))
        except (ValueError, Error) as exc:
            flash("Could not update product. Check that the SKU is unique. " + str(exc), "danger")
    suppliers_list = db_query("SELECT id,name FROM suppliers ORDER BY name")
    return render_template("edit_product.html", product=product, suppliers=suppliers_list)

@app.route("/products/<int:product_id>/delete", methods=["POST"])
@login_required
def delete_product(product_id):
    # Preserve sale history: only allow deleting products that have never been sold.
    if db_query("SELECT id FROM sale_items WHERE product_id=%s LIMIT 1", (product_id,), one=True):
        flash("This product is in sales history, so it cannot be deleted. Set its stock to 0 instead.", "warning")
    else:
        conn=get_db(); cur=conn.cursor()
        cur.execute("DELETE FROM products WHERE id=%s", (product_id,))
        conn.commit(); cur.close(); conn.close()
        flash("Product deleted.", "success")
    return redirect(url_for("products"))

@app.route("/suppliers", methods=["GET", "POST"])
@login_required
def suppliers():
    if request.method == "POST":
        name=request.form.get("name","").strip()
        if not name:
            flash("Supplier name is required.", "danger")
        else:
            conn=get_db(); cur=conn.cursor()
            cur.execute("INSERT INTO suppliers (name,phone,email,address) VALUES (%s,%s,%s,%s)",
                (name,request.form.get("phone","").strip(),request.form.get("email","").strip(),request.form.get("address","").strip()))
            conn.commit(); cur.close(); conn.close()
            flash("Supplier added.", "success")
            return redirect(url_for("suppliers"))
    supplier_list=db_query("""SELECT s.*, COUNT(p.id) AS product_count FROM suppliers s
        LEFT JOIN products p ON p.supplier_id=s.id GROUP BY s.id ORDER BY s.name""")
    return render_template("suppliers.html", suppliers=supplier_list)

@app.route("/suppliers/<int:supplier_id>/delete", methods=["POST"])
@login_required
def delete_supplier(supplier_id):
    conn=get_db(); cur=conn.cursor()
    cur.execute("DELETE FROM suppliers WHERE id=%s", (supplier_id,))
    conn.commit(); cur.close(); conn.close()
    flash("Supplier deleted. Linked products remain in the system.", "success")
    return redirect(url_for("suppliers"))

@app.route("/billing", methods=["GET", "POST"])
@login_required
def billing():
    available_products=db_query("SELECT id,name,sku,selling_price,purchase_price,quantity FROM products WHERE quantity>0 ORDER BY name")
    if request.method == "POST":
        try:
            customer=request.form.get("customer_name","").strip() or "Walk-in Customer"
            payment=request.form.get("payment_method","Cash")
            if payment not in ("Cash","UPI","Card"):
                payment="Cash"
            ids=request.form.getlist("product_id[]")
            qtys=request.form.getlist("quantity[]")
            cart={}
            for pid, qty in zip(ids,qtys):
                pid=int(pid); qty=int(qty)
                if qty>0: cart[pid]=cart.get(pid,0)+qty
            if not cart: raise ValueError("Add at least one product.")
            conn=get_db(); cur=conn.cursor(dictionary=True)
            conn.start_transaction()
            subtotal=Decimal("0.00"); items=[]
            for pid, qty in cart.items():
                cur.execute("SELECT * FROM products WHERE id=%s FOR UPDATE", (pid,))
                p=cur.fetchone()
                if not p or p["quantity"] < qty:
                    raise ValueError("Insufficient stock for " + (p["name"] if p else "a selected product"))
                price=Decimal(str(p["selling_price"])); cost=Decimal(str(p["purchase_price"]))
                line=price*qty; subtotal+=line
                items.append((p,qty,price,cost,line))
            discount=Decimal(request.form.get("discount","0"))
            if discount<0 or discount>subtotal: raise ValueError("Discount must be between 0 and subtotal.")
            total=subtotal-discount
            invoice="INV-"+datetime.now().strftime("%Y%m%d%H%M%S%f")
            cur.execute("""INSERT INTO sales (invoice_no,customer_name,subtotal,discount,total,payment_method)
                VALUES (%s,%s,%s,%s,%s,%s)""",(invoice,customer,subtotal,discount,total,payment))
            sale_id=cur.lastrowid
            for p,qty,price,cost,line in items:
                cur.execute("""INSERT INTO sale_items
                    (sale_id,product_id,product_name,quantity,unit_price,unit_cost,line_total)
                    VALUES (%s,%s,%s,%s,%s,%s,%s)""",(sale_id,p["id"],p["name"],qty,price,cost,line))
                cur.execute("UPDATE products SET quantity=quantity-%s WHERE id=%s",(qty,p["id"]))
            conn.commit(); cur.close(); conn.close()
            return redirect(url_for("invoice", sale_id=sale_id))
        except (ValueError, Error) as exc:
            try: conn.rollback(); cur.close(); conn.close()
            except Exception: pass
            flash("Sale not saved: " + str(exc), "danger")
            return redirect(url_for("billing"))
    return render_template("billing.html", products=available_products)

@app.route("/invoice/<int:sale_id>")
@login_required
def invoice(sale_id):
    sale=db_query("SELECT * FROM sales WHERE id=%s",(sale_id,),one=True)
    if not sale:
        flash("Invoice not found.","warning"); return redirect(url_for("sales"))
    items=db_query("SELECT * FROM sale_items WHERE sale_id=%s ORDER BY id",(sale_id,))
    profit=sum((Decimal(str(i["unit_price"]))-Decimal(str(i["unit_cost"])))*i["quantity"] for i in items)-Decimal(str(sale["discount"]))
    return render_template("invoice.html", sale=sale, items=items, profit=profit)

@app.route("/sales")
@login_required
def sales():
    start=request.args.get("start","")
    end=request.args.get("end","")
    conditions=[]; params=[]
    if start: conditions.append("DATE(created_at)>=%s"); params.append(start)
    if end: conditions.append("DATE(created_at)<=%s"); params.append(end)
    where=(" WHERE "+" AND ".join(conditions)) if conditions else ""
    sale_list=db_query("SELECT * FROM sales"+where+" ORDER BY created_at DESC LIMIT 500",tuple(params))
    summary=db_query("SELECT COUNT(*) AS count, COALESCE(SUM(total),0) AS revenue FROM sales"+where,tuple(params),one=True)
    return render_template("sales.html", sales=sale_list, summary=summary, start=start, end=end)

@app.route("/reports")
@login_required
def reports():
    monthly=db_query("""SELECT DATE_FORMAT(created_at,'%Y-%m') AS month,
        COUNT(*) AS orders, COALESCE(SUM(total),0) AS revenue
        FROM sales GROUP BY DATE_FORMAT(created_at,'%Y-%m') ORDER BY month DESC LIMIT 12""")
    top_products=db_query("""SELECT product_name, SUM(quantity) AS units_sold,
        SUM(line_total) AS revenue FROM sale_items GROUP BY product_id,product_name
        ORDER BY units_sold DESC LIMIT 10""")
    profit=db_query("""SELECT COALESCE(SUM((unit_price-unit_cost)*quantity),0) AS gross_profit
        FROM sale_items""",one=True)
    total_discount=db_query("SELECT COALESCE(SUM(discount),0) AS discount FROM sales",one=True)
    net_profit=Decimal(str(profit["gross_profit"]))-Decimal(str(total_discount["discount"]))
    return render_template("reports.html", monthly=monthly, top_products=top_products, net_profit=net_profit)

@app.route("/setup")
def setup():
    # Helpful diagnostic screen; never displays database password.
    try:
        init_db()
        return "Database connection successful and tables are ready. Go to /login. Demo login: admin / admin123"
    except Error as exc:
        return ("Database setup failed. First create database 'smart_shop_db' in phpMyAdmin and check DB_CONFIG in app.py. "
                "Details: " + str(exc)), 500

if __name__ == "__main__":
    try:
        init_db()
        print("Smart Shop database ready.")
    except Error as exc:
        print("Database connection failed:", exc)
        print("Create smart_shop_db in phpMyAdmin and check DB_CONFIG in app.py.")
    app.run(debug=True)
