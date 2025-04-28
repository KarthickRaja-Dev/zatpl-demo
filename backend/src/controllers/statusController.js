import { Status } from "../model/Status.js";
const fetchStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const topics = await Status.findOne({ candidate: id });
    if (!topics) {
      return res.status(404).json({ message: "Status not found" });
    }
    console.log(topics.tasks,"Sent")
    res.json({ topics });
  } catch (error) {
    console.log(error)
    res.status(500).json({message:error.message});
  }
};

const updateStatus = async (req, res) => {
  try {
    const { topics } = req.body;
    //console.log("Updation Request",topics);
    const statusController = await Status.findOneAndUpdate(
      {
        candidate: req.params.id,
      },
      { $set: {topics} }
    );
    // const statusController = await Status.findByIdAndUpdate(
    //   req.params.id,
    //   { topics },
    // );
    console.log("Updation Complete", statusController);
    if (!statusController) {
      return res.status(404).json({ message: "Status not found" });
    }
    res.json({ statusController });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const updateTopicStatus = async (req, res) => {
  try {
    const { tasks } = req.body;
    console.log("Updation Request",tasks,"Body",req.body);
    const statusController = await Status.findOneAndUpdate(
      {
        candidate: req.params.id,
      },
      { $set: { tasks } }
    );
    // const statusController = await Status.findByIdAndUpdate(
    //   req.params.id,
    //   { topics },
    // );
    if (!statusController) {
      return res.status(404).json({ message: "Status not found" });
    }
    res.json({ statusController });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const addStatus = async (candidate, topics) => {
  try {
    const statusController = new Status({
      candidate,
      topics,
    });
    await statusController.save();
    console.log("Modules",statusController);
  } catch (error) {
    console.log(error.message);
  }
};

export { fetchStatus, updateStatus, addStatus, updateTopicStatus };
