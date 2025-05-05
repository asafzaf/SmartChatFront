// src/data/dummyMessage.js

const dummyMessage = `## What is Object-Oriented Programming (OOP)?

Object-Oriented Programming (OOP) is a programming paradigm based on the concept of "objects", which contain data and methods.

### 🧱 Main Principles of OOP:
- **Encapsulation**: Bundling data and methods that operate on that data.
- **Abstraction**: Hiding complex implementation details and showing only the necessary features.
- **Inheritance**: Enabling new classes to reuse and extend existing classes.
- **Polymorphism**: Allowing objects to be treated as instances of their parent class, even if they behave differently just add more text more text more text more text more text .

### 💻 Code Example (JavaScript):
\`\`\`javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(\`\${this.name} makes a sound.\`);
  }
}

class Dog extends Animal {
  speak() {
    console.log(\`\${this.name} barks.\`);
  }
}

const dog = new Dog("Rex");
dog.speak(); // Rex barks.
\`\`\`

### 📌 Summary:
OOP helps organize code in a modular, reusable, and scalable way by modeling real-world entities using objects.`;

export default dummyMessage;
