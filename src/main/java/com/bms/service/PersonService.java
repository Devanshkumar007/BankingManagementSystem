package com.bms.service;

import com.bms.model.Person;

public interface PersonService {
	
	Person addPerson(Person p);
	Boolean removePerson(int id);
	Person findById(int id);
	Person updatePerson(Person p);
	Person addAccount(int id);
}
