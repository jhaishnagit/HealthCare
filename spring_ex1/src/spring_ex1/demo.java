package spring_ex1;

import java.util.List;

import org.springframework.context.ApplicationContext;

import org.springframework.context.support.FileSystemXmlApplicationContext;

public class demo {

    public static void main(String[] args) {

        ApplicationContext containner =
                new FileSystemXmlApplicationContext("C:\\Users\\Lenovo\\Downloads\\jhaishna\\Project\\spring_ex1\\applicationContext.xml");

        Object o =  containner.getBean("cobj");

         Colleges c=(Colleges) o;
         c.display();
         List<Student> s=c.allstudents();
         
         System.out.println("------ Student List ------");

         for(Student su :s) {
             System.out.println(su);
         }
    }
}