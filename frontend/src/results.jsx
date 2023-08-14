
import React from 'react';
import { useLocation } from 'react-router-dom';
import './results.css';
import logo from './duck.png'
import { useState, useEffect } from 'react';

function handleName(name) {
    let indexOfBeach = name.indexOf("beach");
    if (indexOfBeach !== -1) {
        name = name.substring(0, indexOfBeach).trim();
    } else {
        indexOfBeach = name.indexOf("Beach");
        if (indexOfBeach !== -1) {
            name = name.substring(0, indexOfBeach).trim();
        }
    }
    return name + " beach";
}

function Header(props) {
    return (
        <div id="dheader">
            <h1>{handleName(props.BEACH_OR_CITY_NAME)} <span className="accessname"> <i>{props.ACCESS_NAME}</i></span></h1>
        </div>
    );
}

function SM(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const hoursDisplay = hours < 10 ? hours : hours;
    const minutesDisplay = minutes < 10 ? minutes : minutes;
    if (hoursDisplay != 0)
        return `${hoursDisplay} hours, ${minutesDisplay} minutes away`;
    else
        return `${minutesDisplay} minutes away`;
}
function Location(props) {
    /*
    let long = props.long;
    let lat = props.lat;
    let key = 'AIzaSyCACq2d57S_JUpmUOWBWvENc8GHnkHP89k';
    let query = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${key}`;

    fetch(query)
    .then(res => res.json())
    .then(res => {

        
    })
    */
    //console.log(props.time);
    return (
        <p className = "time">{SM(props.time)} </p>
    )
}

function Review(data) {
    const [reviews, setReviews] = useState({
        rating: 0,       // Set default values or adjust as needed
        numRatings: 0,    // Set default values or adjust as needed
        imageUrl: ""
    });


    useEffect(() => {
        const latitude = data.lat; // Replace with the actual latitude
        const longitude = data.long; // Replace with the actual longitude
        const postData = {
            latitude: latitude,
            longitude: longitude
        }
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify(postData),
        };
        fetch('/send-stars', requestOptions)
            .then(res => res.json())
            .then(res => {
                setReviews({
                    rating: res.rating,
                    numRatings: res.numRatings,
                    photoUrl: res.photoUrl
                });
            })
            .catch((error) => console.error(error));
    }, [data.lat, data.long])


    return (
        <div className='ir'>
            <img className="image" src={reviews.photoUrl} ></img>

            <div className="info">
                <div className="ratings">
                    <h1>{reviews.rating}<i className="fa-regular fa-star"></i></h1>
                    <p>Based on {reviews.numRatings} ratings</p>

                    <div className="misc">
                        {(data.FOOD_ON_SITE == 'Yes' || data.FOOD_NEARBY == "Yes") ? <i class="fa-solid fa-utensils"></i> : ""}
                        {data.ADA_ACCESSIBLE == 'Yes' ? <i class="fa-solid fa-wheelchair"></i> : ""}
                        {data.LIFEGUARD == 'Yes' ? <i class="fa-solid fa-notes-medical"></i> : ""}
                        {data.RESTROOM == 'Yes' ? <i class="fa-solid fa-restroom"></i> : ""}
                        {data.FISHING_PIER == 'Yes' ? <i class="fa-solid fa-fish-fins"></i> : ""}
                        {(data.MARINA == 'Yes' || data.BOAT_RAMP == 'Yes') ? <i class="fa-solid fa-ship"></i> : ""}
                        {data.PETS_ALLOWED ? <i class="fa-solid fa-dog"></i> : ""}   
                    </div>

                    <p className='seperate-text'>Entrance Fee: {data.ENTRANCE_FEE_AMOUNT ? '$' + data.ENTRANCE_FEE_AMOUNT : "None"}, Parking Fee: {data.PARKING_FEE_AMOUNT ? '$' + data.PARKING_FEE_AMOUNT : "None"}</p>

                </div>
            </div>

        </div>


    );
}




export default function Results(props) {
    const location = useLocation();
    const jsonData = location.state?.jsonData || {};


    return (
        <div className="display">
            {jsonData.map((data) => {
                return (
                    <div className="box">
                        <Header BEACH_OR_CITY_NAME={data.BEACH_OR_CITY_NAME} ACCESS_NAME={data.ACCESS_NAME}></Header>
                        <div className="upper">
                            <Location long={data.X_LONGITUDE} lat={data.Y_LATITUDE} time={data.distance}></Location>
                            <p className="notes">Notes: {data.NOTES || "None"}</p>
                        </div>

                        
                        
                        <div class="display-body">
                            <div class="display-right">
                                <div className="review">
                                    <Review long={data.X_LONGITUDE} lat={data.Y_LATITUDE}
                                    FOOD_ON_SITE = {data.FOOD_ON_SITE} FOOD_NEARBY = {data.FOOD_NEARBY}
                                    ADA_ACCESSIBLE = {data.ADA_ACCESSIBLE} LIFEGUARD = {data.LIFEGUARD}
                                    RESTROOM = {data.RESTROOM} FISHING_PIER = {data.FISHING_PIER}
                                    MARINA = {data.MARINA} BOAT_RAMP = {data.BOAT_RAMP} PETS_ALLOWED = {data.PETS_ALLOWED}
                                    ENTRANCE_FEE_AMOUNT = {data.ENTRANCE_FEE_AMOUNT} 
                                    PARKING_FEE_AMOUNT = {data.PARKING_FEE_AMOUNT}
                                    ></Review>
                                </div>


                            </div>
                        </div>

                    </div>
                )
            })}

        </div>
    );
}