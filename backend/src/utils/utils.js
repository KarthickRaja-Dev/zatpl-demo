import nodemailer from "nodemailer";

async function sendMail(details, context) {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_USER || "88eb14001@smtp-brevo.com",
        pass: process.env.BREVO_PASS || "J015X9dAhQnzFtcZ",
      },
    });

    let mailOptions;

    if (context === "new_candidate") {
      mailOptions = {
        from: `"Zenjade" <${process.env.MAIL_SENDER || "sridharmazenjade@gmail.com"}>`,
        to: details.receiverMail,
        subject: "New Candidate Assigned for Training",
        html: `
          <p>Dear ${details.trainingStaffName},</p>
          <p>A new trainee has been assigned to you. Here are the details:</p>
          <ul>
            <li><strong>Name:</strong> ${details.name}</li>
            <li><strong>Mode of Training:</strong> ${details.modeOfTraining}</li>
            <li><strong>Training Programs:</strong> ${details.trainingName}</li>
            <li><strong>Mobile Number:</strong> ${details.mobile}</li>
          </ul>
          <p>Please ensure the trainee receives proper guidance and support.</p>
          <p>Best regards,<br>Management Team<br>Zenjade Automation and Technology</p>
        `,
      };
    } else if (context === "training_completed") {
      mailOptions = {
        from: `"Zenjade" <${process.env.MAIL_SENDER}>`,
        to: `<${process.env.MAIL_RECEIVER}>`,
        subject: `Training Completion Notification: ${details.name}`,
        html: `
          <p>Dear Management,</p>
          <p>I am pleased to inform you that the following candidate has successfully completed their training:</p>
          <ul>
            <li><strong>Name:</strong> ${details.name}</li>
            <li><strong>Training Program:</strong> ${details.trainingName}</li>
            <li><strong>Completion Date:</strong> ${new Date().toLocaleDateString()}</li>
          </ul>
          <p>Please update records accordingly.</p>
          <p>Best regards,<br>
          Zenjade Training Team
          <br>Zenjade Automation and Technology</p>
        `,
      };
    } else if (context === "payment_reminder") {
      mailOptions = {
        from: `"Zenjade" <${process.env.MAIL_SENDER}>`,
        to: `<${process.env.MAIL_RECEIVER}>`,
        subject: `Payment Reminder: Due Tomorrow for ${details.name}`,
        html: `
          <p>Dear Management Team,</p>
          <p>This is a friendly reminder that the Given Candidate training payment is due ${new Date().toLocaleDateString(
            "en-GB"
          )}.</p>
          <ul>
            <li><strong>Training Name:</strong> ${details.trainingName}</li>
            <li><strong>Due Date:</strong> ${details.nextPaymentDate}</li>
          </ul>
          <p>Please ensure that the payment is completed on time.</p>
          <p>Best regards,<br>Training Team <br>Zenjade Automation and Technology</p>
        `,
      };
    }
    console.log("Mail Sent Probably");
    let info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent: %s", info.messageId);
    console.log("Mail Sent Confirm");
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}


/**[
          "hrzenjade@gmail.com",
          "hrkarthickzenjade@gmail.com",
          "zenjadeautomation@gmail.com",
        ], */

export { sendMail};
