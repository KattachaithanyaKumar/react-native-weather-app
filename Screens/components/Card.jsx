import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "react-native";

//day
const dayClear = require("../../assets/day.png");
const dayClouds = require("../../assets/Clouds.png");
const dayRain = require("../../assets/DayRain.png");
const dayStorm = require("../../assets/DayStorm.png");
const daySnow = require("../../assets/DaySnow.png");
const dayMist = require("../../assets/DayWind.png");

//night
const nightClear = require("../../assets/NightMoon.png");
const nightClouds = require("../../assets/NightClouds.png");
const nightRain = require("../../assets/NightRain.png");
const nightStorm = require("../../assets/NightStorm.png");
const nightSnow = require("../../assets/NightSnow.png");
const nightMist = require("../../assets/NightWind.png");

const formatDate = (date) => {
  const inpDate = new Date(date);

  const options = { year: "numeric", month: "long", day: "numeric" };
  return inpDate.toLocaleDateString("en-US", options);
};

const formatTemp = (temp) => {
  return (temp - 273.15).toFixed(1);
};

const Card = ({ data, night }) => {
  const getTime = () => {
    const dtTxt = data.dt_txt;
    const dateTime = new Date(dtTxt);
    const hour = dateTime.getHours();

    const isNight = hour >= 18;

    if (isNight) {
      return "night";
    } else {
      return "day";
    }
  };

  const getImage = (image) => {
    const time = getTime();

    if (time === "day") {
      switch (image) {
        case "Clear":
          return dayClear;
        case "Clouds":
          return dayClouds;
        case "Rain":
          return dayRain;
        case "Thunderstorm":
          return dayStorm;
        case "Snow":
          return daySnow;
        case "Mist/Fog":
          return dayMist;
        default:
          return dayClear;
      }
    } else if (time === "night") {
      switch (image) {
        case "Clear":
          return nightClear;
        case "Clouds":
          return nightClouds;
        case "Rain":
          return nightRain;
        case "Thunderstorm":
          return nightStorm;
        case "Snow":
          return nightSnow;
        case "Mist/Fog":
          return nightMist;
        default:
          return nightClear;
      }
    }
  };
  return (
    <View style={night ? [styles.card, styles.darkBg] : styles.card}>
      <Text style={styles.date}>{formatDate(data.dt_txt)}</Text>
      <Text style={styles.temp}>{formatTemp(data.main.temp)}°</Text>
      <Image source={getImage(data.weather[0].main)} style={styles.logo} />
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#e8e8e8",
    borderColor: "white",
    borderWidth: 1,
    justifyContent: "space-around",
    width: "90%",
    marginHorizontal: "5%",
    marginVertical: "2%",
    borderRadius: 32,
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    aspectRatio: 1,
    marginVertical: 12,
    resizeMode: "contain",
  },
  date: {
    fontWeight: "400",
  },
  temp: {
    fontWeight: "900",
    fontSize: 20,
  },
  darkBg: {
    backgroundColor: "#9CA3AF",
    borderWidth: 0,
  },
});
