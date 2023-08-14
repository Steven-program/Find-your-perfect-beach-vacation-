import React, { useEffect, useState } from "react";


export default function Location() {
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Now you can send this data to your backend.
                const postData = {
                    latitude: latitude,
                    longitude: longitude
                };
                console.log(postData);
                const requestOptions = {
                    method: "POST",
                    headers: {
                        'Content-type': "application/json"
                    },
                    body: JSON.stringify(postData),
                };

                
                fetch('/home', requestOptions)
            });
        } else {
            console.log("Geolocation is not available.");
        }
    }, []);

    return (
        <>
        </>
    );
}