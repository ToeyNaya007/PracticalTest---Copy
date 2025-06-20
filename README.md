
# PracticalTest

โปรเจ็กต์นี้คือการตั้งค่าระบบสำหรับ **PracticalTest** ซึ่งเป็นส่วนหนึ่งของการพัฒนาแอปพลิเคชัน โดยมีการเชื่อมต่อกับ **frontend** และ **backend** เพื่อทำงานร่วมกัน

## โดยรายละเอียดประกอบด้วย
### ระบบ Login และ Register ต้องเข้าสู่ระบบก่อนถึงจะใช้งานระบบได้
### หน้า Page ประกอบด้วย
/dashboard ดูภาพรวมของระบบ
/users ดูรายการผู้ใช้ในรูปแบบตาราง พร้อมทั้ง ส่งออกเป็นรูปแบบ CSV
/users/add สำหรับเพิ่มผู้ใช้ 
/roles ดูรายการ role รูปแบบตาราง

### API ประกอบด้วย
POST /register สำหรับให้ผู้ใช้สมัครสมาชิก โดยจะได้ role เป็น user
bodyRequire name, email, password
POST /login สำหรับให้ผู้ใช้เข้าสู่ระบบ
bodyRequire email, password

(GET /users) ดึงข้อมูลผู้ใช้ทั้งหมด
(GET /users/:id) ดึงข้อมูลผู้ใช้ตามไอดี
(POST /users) เพิ่มข้อมูลผู้ใช้ในหลังบ้าน 
bodyRequire name, email, password
(PUT /users/:id) แก้ไขข้อมูลผู้ใช้
bodyRequire name, email, password, roleId
DELETE /users/:id ลบข้อมูลผู้ใช้

(GET /roles) ดึงข้อมูลบทบาททั้งหมด
(POST /roles) เพิ่มบทบาทใหม่

(GET /permissions) ดึงข้อมูลการอนุญาต
(POST /permissions) เพิ่มข้อมูลการอนุญาต

(GET /dashboard-stats) ดึงข้อมูลสถิติของผู้ใช้
(GET /dashboard-LastCreatedUsers) ดึงข้อมูลผู้ใช้ที่สมัครล่าสุด 6 คน
(GET /dashboard-userGrowth) ดึงข้อมูลผู้ใช้ย้อนหลัง 3 เดือน

## ขั้นตอนการติดตั้ง

### 1. Clone โปรเจ็กต์

ก่อนอื่นให้ clone โปรเจ็กต์นี้ลงในเครื่องของคุณ:

```bash
git clone https://github.com/ToeyNaya007/PracticalTest---Copy.git
cd PracticalTest---Copy
```

### 2. ติดตั้ง Dependencies

#### ติดตั้ง Dependencies ของ **Frontend**:

- เปิด **Terminal** หรือ **Command Prompt** และไปที่โฟลเดอร์ `frontend`:
  ```bash
  cd frontend
  ```

- ติดตั้ง dependencies สำหรับ **frontend** โดยใช้ `npm` หรือ `yarn`:
  - หากใช้ **npm**:
    ```bash
    npm install
    ```

  - หากใช้ **yarn**:
    ```bash
    yarn install
    ```

#### ติดตั้ง Dependencies ของ **Backend**:

- ไปที่โฟลเดอร์ **backend**:
  ```bash
  cd ../backend
  ```

- ติดตั้ง dependencies สำหรับ **backend**:
  - หากใช้ **npm**:
    ```bash
    npm install
    ```

  - หากใช้ **yarn**:
    ```bash
    yarn install
    ```

### 3. การตั้งค่าตัวแปรสภาพแวดล้อม

โปรเจ็กต์นี้ใช้ไฟล์ `.env` สำหรับการตั้งค่าตัวแปรสภาพแวดล้อมที่จำเป็นในการเชื่อมต่อกับฐานข้อมูลหรือเซิร์ฟเวอร์:

1. คัดลอกไฟล์ `.env.example` เป็น `.env`:
   ```bash
   cp .env.example .env
   ```

2. เปิดไฟล์ `.env` และตั้งค่าตัวแปรที่จำเป็น เช่น `DB_HOST`, `DB_USER`, `DB_PASSWORD`, ฯลฯ

### 4. การเชื่อมต่อกับฐานข้อมูล
กรุณานำเข้าฐานข้อมูลที่กระผมได้แนบไป
หากโปรเจ็กต์นี้เชื่อมต่อกับฐานข้อมูล เช่น MySQL หรือ PostgreSQL, ให้ติดตั้งฐานข้อมูลและตั้งค่าในไฟล์ `.env`.

### 5. การเริ่มต้นโปรเจ็กต์

#### เริ่มต้น **Frontend**:
- ไปที่โฟลเดอร์ `frontend` และรันคำสั่งนี้เพื่อเริ่มเซิร์ฟเวอร์:
  ```bash
  npm run dev
  ```

#### เริ่มต้น **Backend**:
- ไปที่โฟลเดอร์ `backend` และรันคำสั่งนี้เพื่อเริ่มเซิร์ฟเวอร์:
  ```bash
  npm run dev
  ```

### 6. การเข้าถึงแอปพลิเคชัน

เมื่อทุกอย่างทำงานได้เรียบร้อยแล้ว, คุณสามารถเข้าถึงแอปพลิเคชันที่รันบน **Frontend** โดยเปิดในเบราว์เซอร์ที่ `http://localhost:3000` และ **Backend** ที่ `http://localhost:5000` (หรือที่ตั้งค่าของคุณ)

---

## การติดตั้งและใช้งานอื่นๆ

โปรเจ็กต์นี้สามารถขยายได้ตามต้องการ และสามารถปรับแต่งการตั้งค่าเพิ่มเติมได้ที่ไฟล์ `README.md` หรือการตั้งค่าในไฟล์ `.env`.

Account สำหรับทดสอบ

Admin
email : michael@example.com
password : 123

User
email : william@example.com
password : 123

หากคุณพบปัญหาหรือข้อผิดพลาดในการติดตั้งโปรเจ็กต์, กรุณาติดต่อ [ToeyNaya](https://github.com/ToeyNaya007) หรือ โทร 084-251-7806.
