(function (global) {
  "use strict";

  const classes = [
    {
      id: "yoga",
      name: "Yoga",
      price: 8,
      sessions: [
        { id: "yoga-mon-1800", day: "Monday", time: "18:00", initialPlaces: 10 },
        { id: "yoga-wed-1900", day: "Wednesday", time: "19:00", initialPlaces: 6 },
        { id: "yoga-sat-1000", day: "Saturday", time: "10:00", initialPlaces: 2 }
      ]
    },
    {
      id: "pilates",
      name: "Pilates",
      price: 10,
      sessions: [
        { id: "pilates-tue-1800", day: "Tuesday", time: "18:00", initialPlaces: 8 },
        { id: "pilates-thu-1900", day: "Thursday", time: "19:00", initialPlaces: 4 },
        { id: "pilates-sat-1130", day: "Saturday", time: "11:30", initialPlaces: 0 }
      ]
    },
    {
      id: "functional-training",
      name: "Functional Training",
      price: 12,
      sessions: [
        { id: "functional-mon-1930", day: "Monday", time: "19:30", initialPlaces: 5 },
        { id: "functional-wed-1800", day: "Wednesday", time: "18:00", initialPlaces: 10 },
        { id: "functional-fri-1830", day: "Friday", time: "18:30", initialPlaces: 3 }
      ]
    },
    {
      id: "spinning",
      name: "Spinning",
      price: 11,
      sessions: [
        { id: "spinning-tue-1930", day: "Tuesday", time: "19:30", initialPlaces: 7 },
        { id: "spinning-thu-1800", day: "Thursday", time: "18:00", initialPlaces: 1 },
        { id: "spinning-sun-1000", day: "Sunday", time: "10:00", initialPlaces: 10 }
      ]
    }
  ];

  classes.forEach(function (classItem) {
    classItem.sessions.forEach(Object.freeze);
    Object.freeze(classItem.sessions);
    Object.freeze(classItem);
  });
  Object.freeze(classes);

  function getClass(classId) {
    return classes.find(function (classItem) {
      return classItem.id === classId;
    }) || null;
  }

  function getSession(classId, sessionId) {
    const classItem = getClass(classId);
    if (!classItem) {
      return null;
    }

    return classItem.sessions.find(function (session) {
      return session.id === sessionId;
    }) || null;
  }

  function getSessionKey(classId, sessionId) {
    return classId + ":" + sessionId;
  }

  function getAllSessions() {
    return classes.reduce(function (allSessions, classItem) {
      return allSessions.concat(classItem.sessions.map(function (session) {
        return {
          classId: classItem.id,
          className: classItem.name,
          session: session
        };
      }));
    }, []);
  }

  function createInitialState() {
    const availability = {};
    getAllSessions().forEach(function (item) {
      availability[getSessionKey(item.classId, item.session.id)] = item.session.initialPlaces;
    });

    return {
      availability: availability,
      bookings: []
    };
  }

  global.GymData = Object.freeze({
    classes: classes,
    getClass: getClass,
    getSession: getSession,
    getSessionKey: getSessionKey,
    getAllSessions: getAllSessions,
    createInitialState: createInitialState
  });
})(window);