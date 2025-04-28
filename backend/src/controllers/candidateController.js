import Candidate from "../model/Candidate.js";
import User from "../model/User.js";
import { sendMail } from "../utils/utils.js";
import {masterPrograms} from "../utils/data.js" ;
import { addStatus } from "./statusController.js";
import { Status } from "../model/Status.js";
export const addCandidate = async (req, res) => {
  try {
    const {
      name,
      candidateCode,
      joiningDate,
      modeOfTraining,
      trainingName,
      nextPaymentDate,
      paymentStatus,
      trainingStaff,
      mobile,
    } = req.body;
    console.log("Mode of Training :", modeOfTraining);
    const candidate = new Candidate({
      name,
      candidateCode,
      joiningDate,
      modeOfTraining,
      trainingName,
      nextPaymentDate,
      paymentStatus,
      trainingStaff,
      mobile,
    });
    const staff = await User.findById(trainingStaff);
    await candidate.save();
    sendMail(
      {
        name,
        modeOfTraining,
        trainingName,
        trainingStaffName: staff.name,
        nextPaymentDate,
        paymentStatus,
        mobile,
        receiverMail: staff.email,
      },
      "new_candidate"
    );
    const modules = [];
    masterPrograms.map((training) => {
        if (training.training == trainingName[0]) {
          modules.push({ trainingName, modules: training.modules });
        }
      ;
    });
    addStatus(candidate._id, modules);
    res
      .status(201)
      .json({ message: "Candidate added successfully", candidate });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().populate("trainingStaff", "name");
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getCandidatesByPaymentStatus = async (req, res) => {
  try {
    const candidates = await Candidate.find({ paymentStatus: "pending" });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCandidatesByTrainingStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const candidates = await Candidate.find({
      trainingStaff: staffId,
    }).populate("trainingStaff", "name");
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCandidateTrainingName = async (req, res) => {
  try {
    const { id } = req.params;
    const { trainingName } = req.body;
    console.log("Training : ",trainingName);

    const candidate = await Candidate.findById(id);
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });
    candidate.trainingName.push(trainingName);
    candidate.save()
    const status = await Status.findOne({ candidate: id });

    if (status) {
      masterPrograms.forEach((training) => {
        if (training.training === trainingName) {
          status.topics.push({
            trainingName,
            modules: training.modules,
          });
        }
      });

      await status.save(); 
    } else {
      console.log("Status not found for candidate ID:", id);
      return res.json({message:"Status Not Found"})
    }
    console.log(candidate)
    await candidate.save()

    res.json({ message: "Training name updated successfully", candidate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCandidatePaymentDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { nextPaymentDate } = req.body;

    const candidate = await Candidate.findById(id);
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });

    candidate.nextPaymentDate = nextPaymentDate;
    await candidate.save();

    res.json({ message: "Payment date updated successfully", candidate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findByIdAndDelete(id);
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });
    res.json({ message: "Candidate Deleted Successfully", candidate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateCandidatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const candidate = await Candidate.findById(id);
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });

    candidate.paymentStatus = paymentStatus;
    await candidate.save();

    res.json({ message: "Payment status updated successfully", candidate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

