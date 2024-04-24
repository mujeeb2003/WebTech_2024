import express from 'express'
const router = express.Router();
import { db } from "../models/index.js"

router.get('/students', async (req, res) => {
    const students = await db.Student.aggregate([
        { $lookup: { from: "marks", foreignField: "regno", localField: "regno", as: "obtain" } },
        { $unwind: "$obtain" },
        { $group: { _id: { regno: "$regno", name: "$name" }, total: { $sum: "$obtain.marks" } } },
        { $project: { _id: 0, regno: "$_id.regno", name: "$_id.name", total: { $round: ["$total", 0] } } },
        {
            $lookup: {
                from: "grades",
                let: { score: "$total" },
                pipeline: [{ $match: { $expr: { $and: [{ $gte: ["$$score", "$start"] }, { $lte: ["$$score", "$end"] }] } } }],
                as: "grade",
            },
        },
        { $unwind: "$grade" },
        { $project: { regno: 1, name: 1, total: 1, grade: "$grade.grade" } },
        {
            $lookup:
            {
                from: "marks",
                foreignField: "regno",
                localField: "regno",
                pipeline: [
                    {
                        $lookup: {
                            from: "heads",
                            localField: "hid",
                            foreignField: "hid",
                            as: "head",
                        },
                    },
                    {
                        $unwind: "$head"
                    }, 
                ],
                as: "marks"
            }
        },
    ])
    res.status(200).json( students);
});


router.put('/students/:regno', async (req, res) => {
  const { regno } = req.params;
  const mark = req.body;
  try {
    const updatedMark = await db.Mark.findOneAndUpdate({ regno, hid: mark.hid }, { $set: mark });
    if (updatedMark.nModified === 0) {
      return res.status(404).json({ message: 'Mark not found' });
    }
    res.status(200).json(updatedMark);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


export default router;