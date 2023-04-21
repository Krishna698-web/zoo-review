document.addEventListener("DOMContentLoaded", () => {
  const animals = document.querySelector("#zoo-animals");
  const animalInfo = document.querySelector("#animal-info");
  const animalForm = document.querySelector("#create-animal");
  animalForm.addEventListener('submit', createNewAnimal);

  fetch("http://localhost:3000/animals")
    .then((response) => response.json())
    .then((animals) =>
      animals.forEach((animal) => {
        slapItOnTheDOM(animal);
      })
    );
  // can be shorten to .then(animals => animals.forEach(slapItOnTheDOM))

  const slapItOnTheDOM = (animal) => {
    let animalLi = document.createElement("li");
    animalLi.dataset.id = animal.id;
    animalLi.innerHTML = `<span>${animal.name} the ${animal.species}</span>`;
    animals.appendChild(animalLi);  //appends the child to existing animals object
    // console.log(animalLi);

    let buttond = document.createElement("button");
    buttond.dataset.id = animal.id;
    buttond.setAttribute("id", `delete-button-${animal.id}`);
    buttond.innerText = "DELETE";
    animals.appendChild(buttond);
    buttond.addEventListener("click", () => {
      deleteAnimal(animal);
    });

    let buttonu = document.createElement("button");
    buttonu.dataset.id = animal.id;
    buttonu.setAttribute("id", `update-button-${animal.id}`);
    buttonu.innerText = "UPDATE";
    animals.appendChild(buttonu);
    buttonu.addEventListener("click", () => {
      editAnimal(animal);
    });
  };

  function gatherFormData() {
    return {
      hobby: event.target.hobby.value,
      image: event.target.image.value,
      name: event.target.name.value,
      species: event.target.species.value,
      ferociousness: event.target.ferociousness.value,
    }
  }


  function createNewAnimal(event) {
    event.preventDefault();
    let newAnimal = gatherFormData();
    return fetch("http://localhost:3000/animals", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(newAnimal)
    })
      .then((res) => res.json())
      .then(animal => (slapItOnTheDOM(animal)));
  }


  function editAnimal(animal) {
    const eForm = document.createElement('form');
    eForm.id = 'update-from';
    eForm.innerHTML = `<h2>Update ${animal.name}</h2>
    Name:<br><input type='text' name='name' value='${animal.name}'><br>
    Species:<br><input type='text' name='species' value='${animal.species}'><br>
    Ferociousness:<br><input type='text' name='ferociousness' value='${animal.ferociousness}'><br>
    Hobby:<br><input type='text' name='hobby' value='${animal.hobby}'><br>
    Image:<br><input type='text' name='image' value='${animal.image}'><br>
    <input type="submit" name="">`;
    animalInfo.append(eForm);
    eForm.addEventListener('submit', (event) => updateAnimal(event, animal));
  }

  function updateAnimal(event, animal) {
    event.preventDefault();
    let updatedAnimal = gatherFormData();
    updateOnBackend(updatedAnimal, animal.id).then(updateOnFrontEnd)
  }

  function updateOnBackend(updatedAnimal, id){
    return fetch(`http://localhost:3000/animals/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updatedAnimal),
      headers: {
        'Content-type': 'application/json',
      }
    }).then(res=>res.json())
    .then(console.log("I've finished fetching"))
  }

  function updateOnFrontEnd(animal){
    console.log(`${animal.name} is being updated`);
    const animalSpan = animals.querySelector(`li[data-id="${animal.id}"]>span`)
    animalSpan.innerHTML = `${animal.name} the ${animal.species}`
  }

  function deleteAnimal(animal) {
    const animalLi = document.querySelector(`[data-id="${animal.id}"]`);
    const buttond = document.querySelector(`#delete-button-${animal.id}`);
    const buttonu = document.querySelector(`#update-button-${animal.id}`);

    return fetch(`http://localhost:3000/animals/${animal.id}`, {
      method: "DELETE"
    })
    .then(response => response.json()).then(() => {
      animalLi.remove();
      buttond.remove()
      buttonu.remove()
    })
  }
});
