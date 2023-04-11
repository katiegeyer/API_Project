import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import "./LandingPage.css";
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";

function LandingPage() {

    const sessionUser = useSelector((state) => state.session.user);

  let joinBeatupButton;
  if (sessionUser) {
    joinBeatupButton = null;
  } else { joinBeatupButton =
        <section className="join-beat-up">
             <OpenModalButton
          buttonText="Join Beatup"
          modalComponent={<SignupFormModal />}
        />
    </section>
  }


  return (
    <div className="landing-page-container">
      <section className="landing-page-section1">
        <div className="landing-page-section1-left">
          <h1>Welcome to Meetup</h1>
          <p>
            Discover the world and meet new people who share your interests.
          </p>
        </div>
        <div className="landing-page-section1-right">
          <img
            src="https://via.placeholder.com/350x250.png?text=Infographic"
            alt="Infographic"
          />
        </div>
      </section>
      <section className="landing-page-section2">
        <h2>Join Meetup today</h2>
        <p>
          Get started by creating an account and joining a group in your area.
        </p>
      </section>
      <section className="landing-page-section3">
        <div className="landing-page-section3-column">
          <i className="fas fa-users"></i>
          <NavLink to="/groups" className="landing-page-section3-link">
            See all groups
          </NavLink>
          <p>Find groups that interest you and join the conversation.</p>
        </div>
        <div className="landing-page-section3-column">
          <i className="far fa-calendar-alt"></i>
          <NavLink to="/events" className="landing-page-section3-link">
            Find an event
          </NavLink>
          <p>
            Discover events that match your interests and attend with other
            members.
          </p>
        </div>
        <div className="landing-page-section3-column">
          <i className="fas fa-plus-circle"></i>
          {sessionUser ? (
            <NavLink to="/create-group" className="landing-page-section3-link">
              Start a group
            </NavLink>
          ) : (
            <span className="landing-page-section3-link-disabled">
              Start a group
            </span>
          )}
          <p>Create your own group and invite others to join you.</p>
        </div>
      </section>
        {joinBeatupButton}
    </div>
  );
}

export default LandingPage;
