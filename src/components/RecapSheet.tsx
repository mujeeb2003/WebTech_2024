import axios from 'axios'
import React, { useEffect,useState } from 'react'
import {mark, student} from './types'
import MarksForm from './MarksForm';

export default function RecapSheet() {
  
  const [Students, setStudents] = useState<student[]>();
  const [studentfound, setstudentfound] = useState<student>();
  const [updatedMarks, setUpdatedMarks] = useState<mark[]>([]);
  
  const fetchData = async () => {
    const response = await axios.get(`/api/students`);
    setStudents(response.data);
    // console.log(Students)
  }
  if(Students){
    Students.forEach((student)=>{
      student.marks.sort((a,b) => a.hid - b.hid);
    })
  }

  const handleClick=(regno:string)=>{
    setstudentfound(Students?.find((student) => student.regno === regno))
  }
  
  
  const updateMarks = async (mark:mark)=>{
    console.log("Mark",mark)

    const response = (await axios.put(`/api/students/${mark.regno}`, mark)).data

    console.log(studentfound?.marks.map((m)=> m.hid == response.hid ? {...m,marks:mark.marks}:m))
    // setStudents(updatedStudents)
    setStudents(
      Students?.map((student): student => {
        if (student.regno === mark.regno) {
          return {
            ...student,
            marks: student.marks.map((m) => m.hid === mark.hid ? mark : m)
          };
        } else {
          return student;
        }
      })
    );

    setUpdatedMarks(prevUpdatedMarks => [...prevUpdatedMarks, mark]);
  } 

  const handleClose = () => {
    setstudentfound(undefined);
  }
  useEffect(()=>{
    fetchData();
    
  },[])
  return (
    <>
    <div className="table col">
    <div>RecapSheet</div>
    <table>
    <thead>
    <tr>
    <th>S.no</th>
    <th>Name</th>
    <th>Regno</th>
    {Students?.[0]?.marks.map((mark)=>
      <th>{mark.head.headname}</th>
    )}
    <th>Total</th>
    <th>Precentage</th>
    <th>Grade</th>
    </tr>
    
    <tr>
    <th></th>
    <th></th>
    <th></th>
    {Students?.[0]?.marks.map((mark)=>
      <th>{mark.head.total}</th>
    )}
    <th>100</th>
    <th>%</th>
    <th></th>
    </tr>
    </thead>
    
    <tbody>
    {Students?.map((student,index)=>
      <tr key={index}>
      <td>{index}</td>
      <td><a href="#" onClick={()=>handleClick(student.regno)}>{student.name}</a></td>
      <td>{student.regno}</td>
      {student.marks.map((mark)=>
        <td className={`${updatedMarks.some(m => m.regno === student.regno && m.hid === mark.hid) ? 'blue-field' : ''}`} key={mark._id}>{mark.marks}</td>
      )}
      
      <td>{student.marks.reduce((acc, m) => acc + m.marks, 0)}</td>
      <td>{Math.round(student.marks.reduce((acc, m) => acc + m.marks, 0))}</td>
      <td>{
        student.marks.reduce((acc, m) => acc + m.marks, 0) >= 90 ? "A+" :
        student.marks.reduce((acc, m) => acc + m.marks, 0) >= 85 ? "A" :
        student.marks.reduce((acc, m) => acc + m.marks, 0) >= 80 ? "A-" :
        student.marks.reduce((acc, m) => acc + m.marks, 0) >= 75 ? "B+" :
        student.marks.reduce((acc, m) => acc + m.marks, 0) >= 70 ? "B" :
        student.marks.reduce((acc, m) => acc + m.marks, 0) >= 66 ? "B-" :
        student.marks.reduce((acc, m) => acc + m.marks, 0) >= 63 ? "C+" :
        student.marks.reduce((acc, m) => acc + m.marks, 0) >= 60 ? "C" :
        student.marks.reduce((acc, m) => acc + m.marks, 0) >= 55 ? "C-" :
        "F"
      }</td>
      </tr>
    )}
    </tbody>
    </table>
    </div>
    <div className='col'>
    {studentfound && <MarksForm studentsel={studentfound} updateMarks={updateMarks} closeForm={handleClose}/>}
    </div>
    </>
  )
}
