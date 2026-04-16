const { v4: uuidv4 } = require('uuid');

let workouts = [];

const memoryStore = {
  createWorkout: (workoutData) => {
    // Removemos os values undefined da response json
    const cleanedData = Object.fromEntries(
      Object.entries(workoutData).filter(([_, v]) => v !== undefined)
    );
    
    const newWorkout = { id: uuidv4(), ...cleanedData };
    workouts.push(newWorkout);
    return newWorkout;
  },
  
  checkDuplicate: (nomeTreino, dataTreino) => {
    return workouts.some(workout => {
      return workout.nomeTreino === nomeTreino && workout.dataTreino === dataTreino;
    });
  },

  clearStore: () => {
    workouts = [];
  }
};

module.exports = memoryStore;
