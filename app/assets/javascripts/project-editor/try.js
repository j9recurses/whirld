function Person(name, age) {

    var occupation;

    this.getOccupation = function() { return occupation; };

    this.setOccupation = function(newOcc) { occupation = 

                         newOcc; };

  

    // accessors for name and age    

}

Person.prototype.somePublicMethod = function() {

    // doesn’t work!

    // alert(this.name);

    // this one below works

    alert(this.getName());

};


// class Pet

function Pet(name) {

    this.getName = function() { return name; };

    this.setName = function(newName) { name = newName; };

}



Pet.prototype.toString = function() {

    return "This pet’s name is: " + this.getName();

};

// end of class Pet



var parrotty = new Pet("Parrotty the Parrot");