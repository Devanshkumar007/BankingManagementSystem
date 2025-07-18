package com.bms.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bms.model.Person;

@Repository
public interface PersonRepository extends JpaRepository<Person, Integer>{

}
