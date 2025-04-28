import nodemailer from "nodemailer";
/**import cron from "node-cron";
import fs from "fs";
import path from "path";

import { Parser } from "json2csv";
import Report from "./model/Report.js";
import connectDB from "./config/db.js";

const hello =async () => {
  console.log("📅 Monthly Report Archiving Started");

  try {
    // 1. Fetch reports with candidate name populated
    const reports = await Report.find()
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
      Training: report.trainingName,
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
        user: "88eb14001@smtp-brevo.com",
        pass: "J015X9dAhQnzFtcZ",
      },
    });

    await transporter.sendMail({
      from: '"Monthly Reports" <88eb14001@smtp-brevo.com>',
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
    console.error("❌ Error in monthly report cron:", err);
  }
};
hello() */
let transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "8a0b47001@smtp-brevo.com",
    pass: "zT7X6WVKhGQa28dk",
  },
});
let mailOptions = {
  from: `"Zenjade" <${"sridharmazenjade@gmail.com"}>`,
  to: "karthickzenjade@gmail.com",
  subject: "New Candidate Assigned for Training",
  html: `
          <p>Dear Staff,</p>
          <p>A new trainee has been assigned to you. Here are the details:</p>
          <ul>
            <li><strong>Name:</strong></li>
            <li><strong>Mode of Training:</strong> </li>
            <li><strong>Training Programs:</strong></li>
            <li><strong>Mobile Number:</strong></li>
          </ul>
          <p>Please ensure the trainee receives proper guidance and support.</p>
          <p>Best regards,<br>Management Team<br>Zenjade Automation and Technology</p>
        `,
};
console.log("Mail Sent Probably");
let info = await transporter.sendMail(mailOptions);
console.log("📧 Email sent: %s", info.messageId);
console.log("Mail Sent Confirm");
