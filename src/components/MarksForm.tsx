import  { ChangeEvent, useEffect, useState } from 'react'
import { MarksFormProps, mark, student } from './types'

export default function MarksForm({studentsel,updateMarks,closeForm}:MarksFormProps) {

  const [student, setstudent] = useState<student>(studentsel);
  const [Marks, setMarks] = useState<mark[]>(student.marks);
  const [errmsg, seterrmsg] = useState("");

  const handleChange=(e:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
    const {name,value} = e.currentTarget;
    setMarks((prev)=>{return prev.map((mark)=>{return mark.hid == Number(name)?{...mark,marks:Number(value)}:mark})})
  }


  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {

    e.preventDefault();
    const { name, value } = e.target;
    const markIndex = Marks.findIndex((mark) => mark.hid == Number(name));

    if(Number(value) > Marks[markIndex].head.total){
      seterrmsg(`${Marks[markIndex].head.headname} cannot be greater than ${Marks[markIndex].head.total}`);
      console.log("errmsg",errmsg);
      const updatedMark = {...Marks[markIndex], marks: student.marks[markIndex].marks};
      const updatedMarks = Marks.map(mark => mark.hid === Number(name) ? updatedMark : mark);
      setMarks(updatedMarks);

    }
    else if(studentsel.marks[markIndex].marks==Number(value)){}
    else{
      seterrmsg('');
      updateMarks(Marks[markIndex]);
    }
    
  }
  useEffect(()=>{
    // console.log(studentsel)
    setstudent(studentsel)
    setMarks(studentsel.marks);
    
  },[studentsel,student])
  return (

    <>
    <div>Marks Form</div>
    <div>
    {Object.keys(student).length !== 0 &&
        <form action="">
          <table>
            <tbody key={student._id}>
              <tr>
                <td>name :</td>
                <td>
                  <input type="text" readOnly name="name" value={student.name} id="" />
                </td>
              </tr>
              <tr>
                <td>regno :</td>
                <td>
                  <input type='text' readOnly name="regno" value={student.regno} id=''/>
                </td>
              </tr>
              {Marks.map((mark,index)=>
              <tr key={index}>  
                <td>{mark.head.headname} : </td>
                <td>
                <input type="number" style={{width:"50px"}}
                 name={mark.hid.toString()} value={mark.marks.toString()} onChange={(e)=>handleChange(e)} onBlur={(e)=>handleBlur(e)}  id="" /> /{mark.head.total}
                </td>
              </tr>
              )}
              <tr>
                <td>Total</td>
                <td>
                <input type="text" readOnly name="total" value={Marks.reduce((acc, m) => acc + m.marks, 0)}  id="" />
                </td>
              </tr>
              <tr>
                <td>Percentage</td>
                <td>
                <input type="text" readOnly name="percentage" value={Math.round(Marks.reduce((acc, m) => acc + m.marks, 0))}  id="" />
                </td>
              </tr>
              <tr>
                <td>Grade</td>
                <td>
                <input type="text" readOnly name="grade" 
                value={
                  Marks.reduce((acc, m) => acc + m.marks, 0) >= 90 ? "A+" :
                  Marks.reduce((acc, m) => acc + m.marks, 0) >= 85 ? "A" :
                  Marks.reduce((acc, m) => acc + m.marks, 0) >= 80 ? "A-" :
                  Marks.reduce((acc, m) => acc + m.marks, 0) >= 75 ? "B+" :
                  Marks.reduce((acc, m) => acc + m.marks, 0) >= 70 ? "B" :
                  Marks.reduce((acc, m) => acc + m.marks, 0) >= 66 ? "B-" :
                  Marks.reduce((acc, m) => acc + m.marks, 0) >= 63 ? "C+" :
                  Marks.reduce((acc, m) => acc + m.marks, 0) >= 60 ? "C" :
                  Marks.reduce((acc, m) => acc + m.marks, 0) >= 55 ? "C-" :
                  "F"
                } 
                id="" />
                </td>
              </tr>
              <tr>
                <td></td>
                <td colSpan={2}>
                  <input type="button" value="Close" onClick={closeForm}/>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      
    }
    {errmsg && 
      <div style={{color:"red"}}>{errmsg}</div>
    }
    </div>

    {/* {JSON.stringify(student,null,4)} */}
    </>
  )
}
