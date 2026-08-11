package spring_ex1;

import java.util.List;

public class Colleges {
	
	private String name;
	private String address;
	private List<Student> students;
	//private Student student,student1,student2,student3;
	

	public void display() {
        System.out.println("Spring XML Configuration Working!");
    }

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public List<Student> getStudents() {
		return students;
	}

	public void setStudents(List students) {
		this.students = students;
	}

	
	public List<Student> allstudents()
	{
		
		
		return students;
	}
}
