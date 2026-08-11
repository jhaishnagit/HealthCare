package spring_ex1;

public class Student {
    
	private String name;
	private int id;
	private int fees;
	
//	public Student()
//	{
//		System.out.println("this is the defult constractor of the Student");
//		//super();
//	}
//	
	public Student(String name, int id,int fees)
	{
		System.out.println("this is the Student controller");
		this.name=name;
		this.id=id;
		this.fees=fees;
				
	}
	
}
