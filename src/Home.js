import React from "react";
import { Link } from "react-router-dom";

function Home() {
  const roles = ["mason", "painter", "plumber", "electrician", "carpenter", "welder", "liftTech", "AcTech"];
  return (
    <div>
      <h2>Choose a Role</h2>
      <div>
        {roles.map((role) => (
          <button key={role}>
            <Link to={`/users/${role}`}>{role}</Link>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Home;
