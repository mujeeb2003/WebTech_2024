export type student = {
	_id: string;
	regno: string;
	name: string;
	marks: mark[];
	grade:string
};

export type head = {
	_id: string;
	hid: number;
	headname: string;
	total: number;
};

export type mark = {
	_id: string;
	mid: number;
	regno: string;
	hid: number;
	marks: number;
	head: head;
	status?: number;
};

export type grade = {
	_id: string;
	gradeid: number;
	start: number;
	end: number;
	grade: string;
	gpa: number;
};

export type MarksFormProps = {
	studentsel: student;
	// grades: grade[];
	updateMarks: (mark: mark) => void;
	closeForm: () => void;
};
