package com.bms.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bms.dao.AccountRepository;
import com.bms.dao.PersonRepository;
import com.bms.model.Account;
import com.bms.model.Person;

import jakarta.transaction.Transactional;

@Service
public class PersonServiceImpl implements PersonService{

	@Autowired
	PersonRepository personRepo;
	@Autowired
	AccountRepository accountRepo;
	
	@Override
	@Transactional
	public Person addPerson(Person p) {
		// TODO Auto-generated method stub
		if( personRepo.findById(p.getId()).isPresent() ) return null; 
		personRepo.save(p);
		return p;
	}

	@Override
	@Transactional
	public Boolean removePerson(int id) {
		// TODO Auto-generated method stub
		if( personRepo.findById(id).isPresent() ) {
			personRepo.deleteById(id);
			return true;
		}
		return false;
	}

	@Override
	public Person findById(int id) {
		// TODO Auto-generated method stub
		Person found = personRepo.findById(id).orElse(null);
		return found;
	}

	@Override
	@Transactional
	public Person updatePerson(Person p) {
		// TODO Auto-generated method stub
		Person update = findById(p.getId());
		if(update == null) return null;
		update.setName(p.getName());
		update.setAddress(p.getAddress());
		update.setPhoneNo(p.getPhoneNo());
		update.setRole(p.getRole());
		return update;
	}

	@Override
	@Transactional
	public Person addAccount(int pid, int accid) {
		Person p = personRepo.findById(pid).orElse(null);
		Account acc = accountRepo.findById(accid).orElse(null);
		if(p == null || acc ==null) return null;
			p.getAccounts().add(acc);
		return p;
	}

	@Override
	public List<Person> findall() {
		return personRepo.findAll();
	}

	@Override
	@Transactional
	public Person deleteAccount(int pid, int accid) {
		// TODO Auto-generated method stub
		Person curr = findById(pid);
		if(curr==null) return null;
		List<Account> acc = curr.getAccounts();
		acc.removeIf(a -> a.getAccountNo() == accid);
		return curr;
	}

}
