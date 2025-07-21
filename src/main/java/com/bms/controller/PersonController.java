package com.bms.controller;

import com.bms.model.Person;
import com.bms.service.PersonService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/persons")
@CrossOrigin(origins = {"http://localhost:6969", "http://127.0.0.1:6969"})
public class PersonController {

//    private final PersonService personService;
    @Autowired
    PersonService personService; 

    @PostMapping // POST /api/persons
    public ResponseEntity<Person> addPerson(@RequestBody Person person) {
        Person newPerson = personService.addPerson(person);
        if (newPerson != null) {
            return new ResponseEntity<>(newPerson, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.CONFLICT); // Person with ID might already exist
    }

    @GetMapping("/{id}") // GET /api/persons/{id}
    public ResponseEntity<Person> getPersonById(@PathVariable int id) {
        Person person = personService.findById(id);
        if (person != null) {
            return new ResponseEntity<>(person, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}") // DELETE /api/persons/{id}
    public ResponseEntity<Void> removePerson(@PathVariable int id) {
        if (personService.removePerson(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping // PUT /api/persons (requires 'updatePerson' implementation)
    public ResponseEntity<Person> updatePerson(@RequestBody Person person) {
        // **TODO: Implement updatePerson in PersonServiceImpl first**
        Person updatedPerson = personService.updatePerson(person);
        if (updatedPerson != null) {
            return new ResponseEntity<>(updatedPerson, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Endpoint to add an existing account to a person
    // You might also consider a DTO for this to make it clearer what's being passed
    @PostMapping("/{personId}/accounts/{accountId}") // POST /api/persons/{personId}/accounts/{accountId}
    public ResponseEntity<Person> addAccountToPerson(@PathVariable int personId, @PathVariable int accountId) {
        Person updatedPerson = personService.addAccount(personId, accountId);
        if (updatedPerson != null) {
            return new ResponseEntity<>(updatedPerson, HttpStatus.OK); // Or CREATED if the relationship is new
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Or BAD_REQUEST if relationship already exists
    }
    @GetMapping // <-- ADD THIS: GET /api/persons to get all persons
    public ResponseEntity<List<Person>> getAllPersons() {
        List<Person> persons = personService.findall();
        if (!persons.isEmpty()) {
            return new ResponseEntity<>(persons, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content if list is empty
    }
}