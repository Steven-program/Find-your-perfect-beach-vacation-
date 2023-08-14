import React, { useEffect, useState } from "react";
import './AutoComplete.css';
import Location from "./Location";
import { Link, json } from "react-router-dom";
import Results from "./results";
import { useNavigate } from 'react-router-dom';

function removeItem(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

export default function Input() {
    const [inputValue, setInputValue] = useState('');
    const [matchedLanguages, setMatchedLanguages] = useState([]);
    const [jsonData, setJsonData] = useState(null);
    const navigate = useNavigate();

    const handleClick = async () => {
        const inputValues = inputValue.split(" ");

        /* Handle Input */

        let gulfCoast = false, atlanticCoast = false, noFees = false,
            parking = false, rvParking = false, ada = false, lifeguard = false,
            restroom = false, trail = false, picnic = false, boatRamp = false,
            fishingPier = false, marina = false, pets = false, food = false;
        if (inputValues.includes("Gulf_Coast")) {
            gulfCoast = true;
            removeItem(inputValues, "Gulf_Coast");
        }
        if (inputValues.includes("Atlantic_Coast")) {
            atlanticCoast = true;
            removeItem(inputValues, "Atlantic_Coast");
        }
        if (inputValues.includes("No_Fees")) {
            noFees = true;
            removeItem(inputValues, "No_Fees");
        }
        if (inputValues.includes("parking")) {
            parking = true;
            removeItem(inputValues, "parking");
        }
        if (inputValues.includes("rv_parking")) {
            rvParking = true;
            removeItem(inputValues, "rv_parking");
        }
        if (inputValues.includes("ADA")) {
            ada = true;
            removeItem(inputValues, "ADA");
        }
        if (inputValues.includes("lifeguard")) {
            lifeguard = true;
            removeItem(inputValues, "lifeguard");
        }
        if (inputValues.includes("restroom")) {
            restroom = true;
            removeItem(inputValues, "restroom");
        }
        if (inputValues.includes("trail")) {
            trail = true;
            removeItem(inputValues, "trail");
        }
        if (inputValues.includes("picnic")) {
            picnic = true;
            removeItem(inputValues, "picnic");
        }
        if (inputValues.includes("boat_ramp")) {
            boatRamp = true;
            removeItem(inputValues, "boat_ramp");
        }
        if (inputValues.includes("fishing_pier")) {
            fishingPier = true;
            removeItem(inputValues, "fishing_pier");
        }
        if (inputValues.includes("marina")) {
            marina = true;
            removeItem(inputValues, "marina");
        }
        if (inputValues.includes("pets")) {
            pets = true;
            removeItem(inputValues, "pets");
        }
        if (inputValues.includes("food")) {
            food = true;
            removeItem(inputValues, "food");
        }
        /* Now query to database */

        const postData = {
            BEACH_OR_CITY_NAME: inputValues,
            GULF_COAST: gulfCoast,
            ATLANTIC_COAST: atlanticCoast,
            FEE: noFees,
            PARKING: parking,
            ADA: ada,
            RV_PARKING: rvParking,
            LIFEGUARD: lifeguard,
            RESTROOM: restroom,
            TRAIL: trail,
            PICNIC: picnic,
            BOAT_RAMP: boatRamp,
            FISHING_PIER: fishingPier,
            MARINA: marina,
            PETS_ALLOWED: pets,
            FOOD: food,
        };


        const requestOptions = {
            method: "POST",
            headers: {
                'Content-type': "application/json"
            },
            body: JSON.stringify(postData),
        };


        fetch('/send-data', requestOptions)
            .then(res => res.json())
            .then(res => {
                setJsonData(res)
                navigate('/search_results', { state: { jsonData: res } });
            })
            .catch((error) => console.error(error));
    }

    

    const specifications = ['Gulf_Coast', 'Atlantic_Coast', 'No_Fees', 'parking', 'rv_parking', 'ADA', 'lifeguard', 'restroom', 'trail', 'picnic', 'boat_ramp', 'fishing_pier', 'marina', 'pets', 'food'];


    const handleInputChange = (event) => {
        const newInputValue = event.target.value;
        setInputValue(newInputValue);

        const words = newInputValue.trim().split(' ');
        const lastWord = words.pop();

        if (lastWord === '') {
            setMatchedLanguages([]);
            return;
        }

        const newMatchedLanguages = specifications.filter(language =>
            language.toLowerCase().includes(lastWord.toLowerCase())
        );

        setMatchedLanguages(newMatchedLanguages);
    };

    const handleSelectLanguage = (language) => {
        const words = inputValue.trim().split(' ');
        words[words.length - 1] = language;
        setInputValue(words.join(' '));
        setMatchedLanguages([]);
    };

    return (
        <>
            <div className="autocomplete">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Enter your specifications!"
                    className="form-control"
                />
                {matchedLanguages.length > 0 && (
                    <div className="autocomplete-list">
                        {matchedLanguages.map((language, index) => (
                            <div
                                key={index}
                                className="autocomplete-list-item"
                                onClick={() => handleSelectLanguage(language)}
                            >
                                {language}
                            </div>
                        ))}
                    </div>
                )}
                
                <button onClick={handleClick}>
                    <i class="fas fa-search"></i>
                </button>
              

            </div>
        </>
    );
}