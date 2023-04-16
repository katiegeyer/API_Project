import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import "./LandingPage.css";
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";

function LandingPage() {

  const sessionUser = useSelector((state) => state.session.user);

  let joinSpeakupButton;
  if (sessionUser) {
    joinSpeakupButton = null;
  } else {
    joinSpeakupButton =
      <section className="join-speak-up">
        <OpenModalButton
          buttonText="Join SpeakUp"
          modalComponent={<SignupFormModal />}
        />
      </section>
  }


  return (
    <div className="landing-page-container">
      <section className="landing-page-section1">
        <div className="landing-page-section1-left">
          <h1>The protest platform - Where words become actions</h1>
          <p>
            Whatever you stand for, from excessive amounts of stoplights and general lack of roundabouts to walking in the bikelane and biking on the sidewalk, there are thousands of people who share your stance on SpeakUp.  Protests are happening every day - log in to join the cause.
          </p>
        </div>
        <div className="landing-page-section1-right">
          <img
            src="https://previews.123rf.com/images/tetriss/tetriss2002/tetriss200200057/141097586-group-of-people-with-banners-protest-flat-cartoon-colorful-vector-illustration.jpg"
            alt="Image"
          />
        </div>
      </section>
      <section className="landing-page-section2">
        <h2>How SpeakUp works</h2>
        <p>
          Meet new people who care about the same stuff you do through online and in-person events.  It's free to create an account.
        </p>
      </section>
      <section className="landing-page-section3">
        <div>
          {/* <div className="landing-page-section3-column"> */}
          <NavLink to="/groups" className="landing-page-section3-link">
            <img className="groupImageLP"
              src="https://v.fastcdn.co/u/f91f856b/56343322-0-Group-209.png"
              alt="Image"
            />
            See all groups
          </NavLink>
          <p>Find groups that interest you and join the conversation.</p>
        </div>
        <div>
          {/* <div className="landing-page-section3-column"> */}
          <NavLink to="/events" className="landing-page-section3-link">
            <img className="eventImageLP"
              src="https://v.fastcdn.co/u/f91f856b/56343282-0-Tickets.png"
              alt="Image"
            />
            Find an event
          </NavLink>
          <p>
            Discover events that match your interests and attend with other
            members.
          </p>
        </div>
        <div>
          {/* <div className="landing-page-section3-column"> */}
          {sessionUser ? (
            <NavLink to="/create-group" className="landing-page-section3-link">
              <img className="newGroupImageLP"
                src="https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384"
                alt="Image" />
              Start a new group
            </NavLink>
          ) : (
            <span className="landing-page-section3-link-disabled">
              <img className="newGroupImageLP"
                src="https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384"
                alt="Image" />
              Start a new group
            </span>
          )}
          <p>Create your own group and invite others to join you.</p>
        </div>
      </section>
      {joinSpeakupButton}
    </div>
  );
}

export default LandingPage;
