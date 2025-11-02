// src/api/userApi.ts

export const fetchUsers = (userAge: number) => {
  // Simulate an async API call
  return new Promise<any[]>((resolve) => {
    const simulatedUsers = [
      { id: 1, name: 'User 1', age: 25 },
      { id: 2, name: 'User 2', age: 30 },
      { id: 3, name: 'User 3', age: 28 },
      { id: 4, name: 'User 4', age: 35 },
    ];
    
    const ageMin = userAge - 5;
    const ageMax = userAge + 5;
    
    // Simulate filtering users based on age
    const filteredUsers = simulatedUsers.filter(
      (user) => user.age >= ageMin && user.age <= ageMax
    );
    
    setTimeout(() => {
      resolve(filteredUsers);  // Resolve the promise with the filtered users
    }, 1000);  // Simulating async delay
  });
};
