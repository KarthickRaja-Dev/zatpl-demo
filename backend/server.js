import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js"; // Import MongoDB connection
import routes from "./src/routes/index.js"; // Import routes
import cron from "node-cron";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { Parser } from "json2csv";
import Report from "./src/model/Report.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
connectDB();
app.use("/api", routes);
//api/programs/get/trainings
//api/programs/update/trainings
const PORT = process.env.PORT || 5008;
import Candidate from "./src/model/Candidate.js";
import { sendMail } from "./src/utils/utils.js";

const archiveMonthlyReports = () => {
  cron.schedule("0 0 1 * *", async () => {
    console.log("📅 Monthly Report Archiving Started");

    try {
      // 1. Fetch reports with candidate name populated
      const reports = await Report.find({})
        .populate("candidate", "name")
        .populate("trainingStaff", "name");

      if (reports.length === 0) {
        console.log("No reports found for the month.");
        return;
      }

      // 2. Convert to plain objects with necessary fields
      const reportData = reports.map((report) => ({
        Candidate: report.candidate?.name || "N/A",
        Staff: report.trainingStaff?.name || "N/A",
        Training: report.trainingName || "N/A",
        ScheduleBy: report.scheduleConductedTodayBy || "N/A",
        InTime: report.inTime || "N/A",
        OutTime: report.outTime || "N/A",
        Mode: report.modeOfTraining || "N/A",
        Topic: report.topicTaken || "N/A",
        Status: report.topicStatus || "N/A",
        Present: report.present ? "Yes" : "No",
        LeaveReason: report.reasonForLeave || "N/A",
        OT: report.OT ? "Yes" : "No",
        Date: new Date(report.date).toLocaleDateString("en-GB"),
      }));

      // 3. Convert to CSV
      const parser = new Parser();
      const csv = parser.parse(reportData);

      // 4. Save CSV file
      const now = new Date();
      const month = now.toLocaleString("default", { month: "long" });
      const year = now.getFullYear();
      const fileName = `Monthly_Report_${month}_${year}.csv`;
      const filePath = path.join("reports", fileName);

      // Make sure directory exists
      if (!fs.existsSync("reports")) {
        fs.mkdirSync("reports");
      }

      fs.writeFileSync(filePath, csv);
      console.log("✅ Report CSV saved to:", filePath);

      // 5. Email the report
      const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.BREVO_USER,
          pass: process.env.BREVO_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.MAIL_SENDER,
        to: "hrkarthickzenjade@gmail.com",
        subject: `📊 Monthly Report: ${month} ${year}`,
        text: "Please find attached the monthly training reports.",
        attachments: [
          {
            filename: fileName,
            path: filePath,
          },
        ],
      });

      // 6. Clear the reports collection
      await Report.deleteMany({});
      console.log("🧹 Report collection cleared");
    } catch (err) {
      console.error("❌ Error in monthly report cron:", err.message);
    }
  });
  cron.schedule("0 0 * * *", async () => {
    try {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);
      const candidatesToRemind = await Candidate.find({
        nextPaymentDate: {
          $gte: new Date(tomorrow.setHours(0, 0, 0, 0)), // Start of the day
          $lt: new Date(tomorrow.setHours(23, 59, 59, 999)), // End of the day
        },
      });

      for (const candidate of candidatesToRemind) {
        await sendMail(
          {
            receiverMail: candidate.email,
            name: candidate.name,
            trainingName: candidate.trainingName,
            nextPaymentDate: candidate.nextPaymentDate.toDateString(),
          },
          "payment_reminder"
        );
        console.log(`✅ Payment reminder sent to ${candidate.name}`);
      }
    } catch (error) {
      console.error("❌ Error sending payment reminders:", error);
    }
  });
  cron.schedule("0 0 * * *", async () => {
    try {
      const now = new Date();
      const candidatesToDelete = await CompletedCandidate.find({
        completionDate: { $lte: now },
      });

      for (const completed of candidatesToDelete) {
        await Candidate.findByIdAndDelete(completed.candidate);
        console.log(
          `✅ Deleted candidate ${completed.candidate} after 24 hours.`
        );
        await CompletedCandidate.findByIdAndDelete(completed._id);
      }
    } catch (error) {
      console.error("Error deleting completed candidates:", error);
    }
  });
};
archiveMonthlyReports();
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
