# 🎓 UniGrievance

Welcome to **UniGrievance**, a professional and modern grievance management system built specifically for **MIT Muzaffarpur**. This platform allows students to voice their concerns easily and helps authorities resolve them quickly and transparently.

---

## 🌟 Features

We have completely redesigned the system to be **faster, safer, and more beautiful**. 

1. **Modern Design**: A "Glassmorphism" look that feels like a premium app.
2. **Mobile Ready**: Works perfectly on your phone, tablet, or laptop.
3. **Smart Tracking**: A visual timeline shows exactly where your grievance is (e.g., with the Warden or the Principal).
4. **Safety First**: Students can file grievances **anonymously** (hiding their identity).
5. **Accountability**: If an authority doesn't act within **3 days**, the grievance is automatically sent to their boss!

---

## 🔥 Key Features for Everyone

### For Students 👨‍🎓
- **Easy Filing**: Submit issues in seconds (Hostel, Academic, or General).
- **Anonymity**: Toggle "Hide My Identity" to stay safe.
- **Visual Journey**: Watch your grievance move through levels on a real-time timeline.
- **Feedback**: After a resolution, YOU decide if it's "Done" or if it needs to be "Reopened."

### For Authorities 👮‍♂️
- **Clear Actions**: A dedicated dashboard to see only your assigned grievances.
- **Fast Processing**: Update status (In Progress, Resolved) with one click.
- **Complete Info**: See student details (unless anonymous) and full descriptions clearly.

---

## �️ How to Set Up the Project

Follow these simple steps to run the project on your computer:

### 1. Requirements
- Install **Node.js** from [nodejs.org](https://nodejs.org).
- Have a **MongoDB** account (or run it locally).

### 2. Setting Up the Backend (The Server)
```powershell
# Go to the backend folder
cd backend

# Install the necessary tools
npm install

# Create a '.env' file in the backend folder and add:
PORT=5000
MONGODB_URI=your_mongodb_link
JWT_SECRET=your_random_secret_key
```

### 3. Setting Up the Frontend (The Website)
```powershell
# Go back to the main folder, then into the frontend folder
cd ../frontend

# Install the necessary tools
npm install

# Start the website
npm run dev
```

---

## 🔑 Default Login Accounts (Testing)

Use these accounts to test the different roles in the system. The password for all accounts is `password123`.

| Role | Username / Email | Responsibility |
| :--- | :--- | :--- |
| **Student** | `test@gmail.com` | Files grievances. |
| **Warden** | `warden.h1@mitmuzaffarpur.edu` | Resolves hostel issues. |
| **Chief Warden**| `chief.warden@mitmuzaffarpur.edu`| Handles escalations from Wardens. |
| **HOD** | `hod.cse@mitmuzaffarpur.edu` | Resolves academic issues. |
| **Principal** | `principal@mitmuzaffarpur.edu` | The final authority for all issues. |

---

## 🛡️ The "3-Day Rule"
To ensure no grievance is ignored, we built a **Cron Job**. Every midnight, the system checks for grievances that haven't been touched in **3 days**. 
- A Warden's ignored issue goes to the **Chief Warden**.
- A Chief Warden's or HOD's ignored issue goes directly to the **Principal**.

---

## 🎨 Tech Stack
- **Frontend**: React.js & Vite (Fast & Interactive)
- **Backend**: Node.js & Express (Stable & Secure)
- **Database**: MongoDB (Flexible Data)
- **Styling**: Modern CSS (Premium Aesthetics)

---
*Created with ❤️ for the students of MIT Muzaffarpur.*
