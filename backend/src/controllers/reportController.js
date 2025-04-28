import Report from "../model/Report.js";
import Candidate from "../model/Candidate.js";
import CompletedCandidate from "../model/CompletedCandidate.js";
import nodemailer from "nodemailer";
import { sendMail } from "../utils/utils.js";
const sendReportEmail = async (reportData) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
      },
    });

    // Create HTML table from reportData array
    let tableRows = reportData
      .map((report) => {
        console.log("Report",report);
        return report.present
          ? `
<tr style="background-color: ${
              report.topicStatus === "training completed"
                ? "#d4edda"
                : "transparent"
            };">
  <td>${report.candidate}</td>
  <td>${report.trainingName[0]}</td>
  <td>${report.date}</td>
  <td>${report.inTime}</td>
  <td>${report.outTime}</td>
  <td>${report.modeOfTraining}</td>
  <td>${report.scheduleConductedTodayBy}</td>
  <td>${report.topicTaken}</td>
  <td>${report.topicStatus}</td>
</tr>
`
          : ` <tr>
          <td>${report.candidate}</td>
          <td>${report.trainingName[0]}</td>
          <td>${report.date}</td>
          <td>${report.modeOfTraining}</td>
          <td>Leave Reason : </td>
          <td>${report.reasonForLeave}</td>
        </tr>`;
      })
      .join("");

    let mailOptions = {
      from: `"${reportData[0].scheduleConductedTodayBy}" <${process.env.MAIL_SENDER}>`,
      to: `${process.env.MAIL_RECEIVER}`, // Add recipient email address
      subject: `Submission of Daily Report : ${new Date().toLocaleDateString()}`,
      html: `
        <p>Respected sir,</p>
        <p>I am writing to submit my daily report for Today. Please find attached screenshot for your review.Should you require any further information or clarification, please do not hesitate to reach out.Thank you for your attention</p>
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
          <thead>
            <tr>
              <th>Name</th>
              <th>Training Name</th>
              <th>Date</th>
              <th>In Time</th>
              <th>Out Time</th>
              <th>Mode Of Training</th>
               <th>Training Staff</th>
              <th>Topic Taken</th>
              <th>Topic Status</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <p>Best regards,<br>${reportData[0].scheduleConductedTodayBy}</p>
      `,
    };

    console.log("Mail Sent Probably");
    let info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent: %s", info.messageId);
    console.log("Mail Sent Confirm");
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

export const addReport = async (req, res) => {
  try {
    //console.log(req.body);
    const reports = req.body;
    for (const reportData of reports) {
      const existingCandidate = await Candidate.findById(reportData.candidate);
      if (!existingCandidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }
      reportData.candidate = existingCandidate.name;
      if (!reportData.present) {
        existingCandidate.leaveCount += 1;
        await existingCandidate.save();
        console.log("Leave : ", existingCandidate.leaveCount);
      }
      const newReport = new Report({
        candidate: reportData.candidate,
        trainingName: reportData.trainingName[0],
        trainingStaff: reportData.trainingStaff,
        conductedBy: reportData.conductedBy,
        inTime: reportData.inTime,
        outTime: reportData.outTime,
        modeOfTraining: reportData.modeOfTraining,
        topicTaken: reportData.topicTaken,
        topicStatus: reportData.topicStatus,
        present: reportData.present,
        reasonForLeave: reportData.isPresent ? null : reportData.reasonForLeave,
        date: new Date(),
        OT: reportData.ot,
        scheduleConductedTodayBy: reportData.scheduleConductedTodayBy,
      });
<<<<<<< HEAD
      
      await newReport.save();
      sendReportEmail(reports);
=======

      await newReport.save();
>>>>>>> dd4e0d9b1303a82f4d7c4e6df86b80e718c7918a
      if (reportData.topicStatus == "training completed") {
        console.log("Found Completion Candidate ");

        sendMail(
          {
            name: existingCandidate.name,
            modeOfTraining: existingCandidate.modeOfTraining,
            trainingName: existingCandidate.trainingName,
            trainingStaffName: existingCandidate.trainingStaff.name,
          },
          "training_completed"
        );
        await CompletedCandidate.create({
          candidate: reportData.candidate,
          completionDate: new Date(),
        });
      }
    }
    res.status(201).json({ message: "Reports added successfully" });
  } catch (error) {
    console.error("Error adding report:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getAllReports = async (req, res) => {
  try {
    const { staff } = req.body;
    const reports = await Report.find({ scheduleConductedTodayBy: staff })
      .populate("candidate", "name candidateCode")
      .populate("trainingStaff", "name email");
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReportsByStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const reports = await Report.find({ trainingStaff: staffId })
      .populate("candidate", "name candidateCode")
      .populate("trainingStaff", "name email");
    console.log(reports);

    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReportsByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const reports = await Report.find({
      date: { $gte: startDate, $lte: endDate },
    })
      .populate("candidate", "name candidateCode")
      .populate("trainingStaff", "name email");
    console.log(reports);
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getReportsByStaffAndDate = async (req, res) => {
  try {
    const { date, staffId } = req.params;
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const reports = await Report.find({
      scheduleConductedTodayBy: staffId,
      date: { $gte: startDate, $lte: endDate },
    })
      .populate("candidate", "name candidateCode")
      .populate("trainingStaff", "name email");
    console.log(reports);
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getOtReportByMonth = async (req, res) => {
  try {
    const { staffId } = req.params;
    if (!staffId) {
      return res.status(400).json({ message: "Staff is required" });
    }
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const otReports = await Report.find({
      scheduleConductedTodayBy: staffId,
      OT: true,
      date: { $gte: startDate, $lte: endDate },
    }).populate("candidate trainingStaff", "name email");

    res.status(200).json({ success: true, data: otReports });
  } catch (error) {
    console.error("Error fetching OT reports:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
