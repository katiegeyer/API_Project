import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import "./LandingPage.css";
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";

function LandingPage() {

  const sessionUser = useSelector((state) => state.session.user);

  let joinBeatupButton;
  if (sessionUser) {
    joinBeatupButton = null;
  } else {
    joinBeatupButton =
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
          <h1>The protest platform - Where words become actions</h1>
          <p>
            This platform
          </p>
        </div>
        <div className="landing-page-section1-right">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ7sh13c6IK-RQu2iOm7BGvIpePso74nl8T4bRuhZ4j6EEAJWTNvBpymE1Tqh8Qdb-wN8&usqp=CAU"
            alt="Image"
          />
        </div>
      </section>
      <section className="landing-page-section2">
        <h2>How SpeakUp works</h2>
        <p>
          Join a group filled with people filled with passion.
          <p>Find a protest that aligns with your cause.</p>  <p>
            Or if you don't see your issue being represented - Create your own for others to join. </p>
        </p>
      </section>
      <section className="landing-page-section3">
        <div className="landing-page-section3-column">
          <img className="groupImageLP"
            src="https://v.fastcdn.co/u/f91f856b/56343322-0-Group-209.png"
            alt="Image"
          />
          <NavLink to="/groups" className="landing-page-section3-link">
            See all groups
          </NavLink>
          <p>Find groups that interest you and join the conversation.</p>
        </div>
        <div className="landing-page-section3-column">
          <img className="eventImageLP"
            src="https://v.fastcdn.co/u/f91f856b/56343282-0-Tickets.png"
            alt="Image"
          />
          <NavLink to="/events" className="landing-page-section3-link">
            Find an event
          </NavLink>
          <p>
            Discover events that match your interests and attend with other
            members.
          </p>
        </div>
        <div className="landing-page-section3-column">
          <img className="newGroupImageLP"
            src="https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384"
            alt="Image" />
          {sessionUser ? (
            <NavLink to="/create-group" className="landing-page-section3-link">
              Start a new group
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
