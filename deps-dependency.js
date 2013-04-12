if (Meteor.isClient) {

  // A custom reactive data source that works similarly to
  // the Session object
  ReactiveDataSource = {

    // keys look like { "name": "Chris" }
    keys: {},

    // deps store the same keys as above but the value
    // is a Deps.Dependency instance like this:
    // { "name": new Deps.Dependency }
    deps: {},
    
    // Make sure we've created a dependency object for the key
    // and then call the depend() method to create a dependency.
    // Finally, return the value.
    get: function (key) {
      this.ensureDeps(key);
      this.deps[key].depend();
      return this.keys[key];
    },

    // Set the value of the key to the new value and then call
    // the changed() method on the dependency object which will
    // trigger any dependent functions to be re-run.
    set: function (key, value) {
      this.keys[key] = value;
      this.deps[key].changed();
    },

    // Make sure we create the Deps.Dependency object for the first
    // time
    ensureDeps: function (key) {
      if (!this.deps[key])
        this.deps[key] = new Deps.Dependency;
    }
  };

  printName = function () {
    var name = ReactiveDataSource.get("name");
    console.log("1. The name is: ", name);
  };

  printNameAgain = function () {
    var name = ReactiveDataSource.get("name");
    console.log("2. The name is: ", name);
  };

  counter = 1;
  updateName = function () {
    ReactiveDataSource.set("name", "Chris " + counter++);
  };

  // Re-run each of these functions (printName, printNameAgain) any time
  // a value changes in a reactive data source
  Deps.autorun(printName);
  Deps.autorun(printNameAgain);
}
