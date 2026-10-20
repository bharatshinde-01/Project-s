SMART SHOP MANAGEMENT SYSTEM — TY BBA(CA) PROJECT
Technology: Python + Flask + MySQL + HTML/CSS
Database tool: phpMyAdmin (usually included with XAMPP)

==================== 1. REQUIRED SOFTWARE ====================
1. Python 3.11 or newer
2. XAMPP (Apache and MySQL)
3. A browser (Chrome/Edge)
4. VS Code (recommended, not compulsory)

==================== 2. CREATE DATABASE ====================
1. Open XAMPP Control Panel.
2. Click Start for MySQL. Apache ko bhi Start kar sakte ho.
3. Browser mein open karo: http://localhost/phpmyadmin
4. Left side ya top par "New" click karo.
5. Database name: smart_shop_db
6. Create par click karo.
7. Database select karo, phir Import tab par jao.
8. schema.sql file choose karo and Import/Go click karo.
   Agar import error aaye, database select karke SQL tab mein schema.sql ka
   content paste karna bhi ek option hai.

Note: phpMyAdmin database ka interface hai; actual database MySQL/MariaDB hai.

==================== 3. RUN THE PYTHON PROJECT ====================
1. ZIP ko extract karo.
2. Extracted folder mein terminal/Command Prompt kholo.
3. Virtual environment banao (recommended):
      python -m venv .venv
4. Windows mein activate:
      .venv\Scripts\activate
5. Dependencies install:
      pip install -r requirements.txt
6. app.py open karo. Default XAMPP setup ke liye DB_CONFIG:
      host=localhost, user=root, password="", database=smart_shop_db
   Agar tumhare MySQL root user ka password set hai, DB_PASSWORD set karna
   ya app.py mein DB_CONFIG ka password change karna hoga.
7. Run:
      python app.py
8. Browser mein open:
      http://127.0.0.1:5000

==================== 4. FIRST LOGIN ====================
Username: admin
Password: admin123

App pehli baar run hote hi tables check/create karta hai aur demo admin
account banata hai. Is demo password ko real deployment mein zaroor badlo.
For a college demo, local machine par hi use karo; internet par deploy mat karo
without changing secret key, password and security settings.

==================== 5. FEATURES ====================
- Login / Logout
- Dashboard with today's sales, revenue, estimated profit and low stock
- Add, search, edit and delete products
- Supplier records
- Billing with multiple products, discount and payment method
- Stock automatically decreases after successful sale
- Invoice view and print
- Sales history with date filters
- Monthly revenue and top-selling product reports

==================== 6. COMMON ERRORS ====================
A) "Can't connect to MySQL server"
   XAMPP Control Panel mein MySQL Start karo.

B) "Unknown database smart_shop_db"
   phpMyAdmin mein database create/import karo.

C) "Access denied for user root"
   app.py ke DB_CONFIG mein apna MySQL username/password set karo.

D) "No module named flask" / mysql.connector
   Virtual environment activate karke pip install -r requirements.txt chalao.

E) Port 5000 busy
   app.py ki last line ko app.run(debug=True, port=5001) karo, phir
   http://127.0.0.1:5001 open karo.

==================== 7. PROJECT LIMITATIONS / HONEST NOTES ====================
- This is an educational prototype, not a production-ready POS system.
- Demo admin password must be changed before real use.
- Profit shown is estimated from purchase and selling prices; it excludes rent,
  salaries, taxes, returns and other business costs.
- Make backups before changing or deleting database records.
