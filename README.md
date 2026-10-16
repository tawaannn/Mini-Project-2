# Task Manager

เว็บแอปจัดการงาน (Task Manager) ผู้ใช้สมัครสมาชิก เข้าสู่ระบบ และจัดการรายการงานของตัวเองได้
สร้างด้วย Node.js, Express และ MongoDB Atlas (Mongoose)

## ฟีเจอร์
- สมัครสมาชิก / เข้าสู่ระบบ
- เพิ่ม ดู แก้ไข ลบ งาน (CRUD)
- เก็บข้อมูลบน MongoDB Atlas

## เทคโนโลยีที่ใช้
- Node.js + Express
- MongoDB Atlas + Mongoose
- HTML / CSS / JavaScript (โฟลเดอร์ `public`)
- nodemon (สำหรับตอนพัฒนา)

## วิธีติดตั้ง

1. ติดตั้ง [Node.js](https://nodejs.org) (ตรวจสอบด้วย `node -v`)
2. โคลนหรือดาวน์โหลดโปรเจกต์ แล้วเข้าโฟลเดอร์
   ```bash
   cd [ชื่อโฟลเดอร์โปรเจกต์]
   ```
3. ติดตั้ง dependencies
   ```bash
   npm install
   ```
4. สร้างไฟล์ `.env` ที่โฟลเดอร์นอกสุด (ดูตัวอย่างใน `.env.example`)
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/taskmanager
   JWT_SECRET=ใส่ข้อความอะไรก็ได้ที่เดายาก
   ```
5. ตั้งค่า MongoDB Atlas
   - Database Access: สร้าง user พร้อมสิทธิ์ read/write
   - Network Access: เพิ่ม IP ของเครื่อง (หรือ `0.0.0.0/0` สำหรับงานเรียน)

## วิธีรัน

```bash
npm run dev
```

เมื่อสำเร็จ Terminal จะแสดง `MongoDB connected` จากนั้นเปิดเบราว์เซอร์ที่
**http://localhost:5000**

## รายการ API Endpoints

> ⚠️ แก้ตารางนี้ให้ตรงกับ route ที่มีในโปรเจกต์จริง

| Method | Endpoint | คำอธิบาย | ต้อง Login |
|---|---|---|---|
| POST | `/api/auth/register` | สมัครสมาชิก | ไม่ |
| POST | `/api/auth/login` | เข้าสู่ระบบ | ไม่ |
| GET | `/api/tasks` | ดูรายการงานทั้งหมดของผู้ใช้ | ใช่ |
| POST | `/api/tasks` | เพิ่มงานใหม่ | ใช่ |
| PUT | `/api/tasks/:id` | แก้ไขงาน | ใช่ |
| DELETE | `/api/tasks/:id` | ลบงาน | ใช่ |

### ตัวอย่าง Request

สมัครสมาชิก
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test1","password":"123456"}'
```

## การดีบัก (Debugging)

### ปัญหาที่ 1: เชื่อมต่อ MongoDB Atlas ไม่ได้

**อาการ:** Terminal แสดง `MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster` (`ReplicaSetNoPrimary`)

**สาเหตุ:** IP ของเครื่องยังไม่ได้ถูกเพิ่มใน Network Access ของ Atlas

**วิธีแก้:** Atlas → Security → Network Access → Add IP Address → Allow Access From Anywhere (`0.0.0.0/0`) → รอสถานะ Active → รันเซิร์ฟเวอร์ใหม่ จนขึ้น `MongoDB connected`

![ปัญหาเชื่อมต่อ MongoDB ไม่ได้](docs/images/debug1-mongodb-ip.png)

### ปัญหาที่ 2: E11000 duplicate key (username ซ้ำ)

**อาการ:** สมัครสมาชิกแล้วเกิด `E11000 duplicate key error ... dup key: { username: "tawan" }`

**สาเหตุ:** field `username` ตั้งเป็น `unique` และมี user ชื่อนี้อยู่ในฐานข้อมูลแล้ว

**วิธีแก้:** ดักจับ `err.code === 11000` แล้วตอบกลับ status 409 พร้อมข้อความที่เข้าใจง่าย
```js
catch (err) {
  if (err.code === 11000) {
    return res.status(409).json({ message: 'ชื่อผู้ใช้นี้ถูกใช้แล้ว' });
  }
  res.status(500).json({ message: 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์' });
}
```

![E11000 duplicate key](docs/images/debug2-duplicate-key.png)

### คำสั่งที่ใช้ตอนดีบัก

| คำสั่ง | ใช้ทำอะไร |
|---|---|
| `npm run dev` | รันเซิร์ฟเวอร์ด้วย nodemon ดู log แบบ real-time |
| `rs` | รีสตาร์ท nodemon |
| `netstat -ano \| findstr :5000` | ตรวจว่า port 5000 ถูกใช้อยู่ไหม (Windows) |
| `node -v` / `npm -v` | ตรวจเวอร์ชัน |

## ผู้จัดทำ
[Barameetham Bumrungmitr / 660911033]