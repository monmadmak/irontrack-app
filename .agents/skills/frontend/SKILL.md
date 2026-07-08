---
name: frontend-guidelines
description: ใช้เมื่อผู้ใช้ต้องการสร้าง แก้ไข หรือออกแบบ UI component และหน้าเว็บ (Frontend) สำหรับโปรเจกต์นี้
---

# Advanced Frontend Guidelines for Irontrack (Next.js 15+, React 19)

ทักษะนี้เป็นคู่มือแบบพร้อมใช้งาน (Ready-to-use) ที่รวม Best Practices ระดับมืออาชีพสำหรับการพัฒนา Frontend ด้วย Next.js และ Tailwind CSS 

## 1. Architecture & Component Pattern
- **Server-First Approach:** สร้าง component เป็น Server Component เสมอ (ไม่ต้องมี directive) เพื่อลดขนาด JavaScript ที่ส่งไปยัง Client
- **Isolate Client Logic:** ดัน `'use client'` ไปอยู่ที่ใบไม้ (Leaf components) ของ Component Tree ให้มากที่สุด เช่น ปุ่มกด, ฟอร์ม, หรือส่วนที่มี interactive
- **Composition Pattern:** หาก Client Component ต้องการ render Server Component ข้างใน ให้รับผ่าน `children` prop (อย่า import Server Component ลงใน Client Component โดยตรง)

## 2. Next.js App Router Best Practices
- **Data Fetching:** ใช้ `fetch` บน Server Component เสมอ ไม่ต้องพึงพาไลบรารีภายนอกหากไม่จำเป็น Next.js จะจัดการ caching ให้
- **Server Actions:** ใช้ Server Actions (`'use server'`) สำหรับการจัดการฟอร์มและการเปลี่ยนแปลงข้อมูล (Mutations) แทนการสร้าง API Routes
- **Streaming & Suspense:** ใช้ `loading.tsx` หรือ `<Suspense>` ครอบ component ที่มีการดึงข้อมูล เพื่อสร้าง Loading UI ทันทีไม่ต้องรอให้ข้อมูลมาครบ

## 3. Styling & UI Design (Clean Minimalist Light Theme)
- **Responsive-First:** ดีไซน์จากจอเล็กไปจอใหญ่เสมอ (Mobile-First) เริ่มต้นแบบไม่มี prefix และใช้ `sm:`, `md:`, `lg:` สำหรับจอที่ใหญ่ขึ้น
- **Premium Aesthetics (Strict Tokens):**
  - **Backgrounds:** ใช้สีขาวหรือเทาอ่อนมากเป็นพื้นหลังหลัก (`bg-white` หรือ `bg-gray-50`)
  - **Cards & Containers:** เน้นกล่องสีขาวพร้อมเส้นขอบบางๆ และเงาอ่อนๆ (`bg-white border border-gray-200 rounded-3xl shadow-sm`)
  - **Primary Buttons:** ใช้ปุ่มสีฟ้าสดใส (`bg-blue-500 text-white`) พร้อมเงาอ่อนๆ `shadow-md shadow-blue-500/20` และ hover effect (`hover:bg-blue-600 active:scale-95`)
  - **Secondary/Icon Buttons:** ใช้พื้นหลังสีเทาอ่อน (`bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-900`)
  - **Typography:** เน้นความสะอาดตา ใช้ `font-bold` คู่กับ `tracking-tight` สำหรับหัวข้อ `text-gray-900` สำหรับข้อความหลัก และ `text-gray-500 font-medium` สำหรับข้อความรอง
  - **Status Colors:** สีฟ้า (`blue-500`) สำหรับการกระทำหลัก, สีส้ม (`orange-500`) และม่วง (`purple-500`) สำหรับประเภทของเซ็ต, สีเหลือง (`yellow-500`) สำหรับ PR
- **Semantic HTML:** ใช้แท็กที่สื่อความหมายเสมอ เช่น `<main>`, `<section>`, `<nav>`, `<article>`, `<button>` (แทนที่จะใช้ `<div>` ทำเป็นปุ่ม)
## 4. Code Quality & TypeScript
- **Strict Typing:** ห้ามใช้ `any` หรือ `ts-ignore` สร้าง Interface/Type สำหรับ Props หรือ Data เสมอ
- **Clean Code:** หาก Component เริ่มมีขนาดใหญ่ (เกิน 150-200 บรรทัด) ให้แตกโค้ดย่อยออกเป็น Component เล็กๆ
- **Error Handling:** ใช้ `error.tsx` ในการดักจับข้อผิดพลาดของแต่ละหน้า และต้องมี UI ที่เหมาะสมเพื่อแจ้งเตือนผู้ใช้

## 5. Ecosystem
- **Icons:** ใช้ `lucide-react` เท่านั้น ปรับขนาดผ่าน prop `size` และสีผ่าน class ของ Tailwind (เช่น `className="text-gray-500"`)
- **Charts:** ใช้ `recharts` โดยแยกออกมาเป็น Client Component และพยายามใช้ ResponsiveContainer เสมอ
