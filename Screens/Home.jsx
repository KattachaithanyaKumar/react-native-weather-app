import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import Card from "./components/Card";
import { Image } from "react-native";

//day
const dayClear = require("../assets/day.png");
const dayClouds = require("../assets/Clouds.png");
const dayRain = require("../assets/DayRain.png");
const dayStorm = require("../assets/DayStorm.png");
const daySnow = require("../assets/DaySnow.png");
const dayMist = require("../assets/DayWind.png");

//night
const nightClear = require("../assets/NightMoon.png");
const nightClouds = require("../assets/NightClouds.png");
const nightRain = require("../assets/NightRain.png");
const nightStorm = require("../assets/NightStorm.png");
const nightSnow = require("../assets/NightSnow.png");
const nightMist = require("../assets/NightWind.png");

const loadingImg = require("../assets/loading.gif");

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const Home = () => {
  const floatAnimation = useRef(new Animated.Value(0)).current;

  const [data, setData] = useState(null);
  const [daysData, setDaysData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [night, setNight] = useState(true);

  useEffect(() => {
    const floatUpAndDown = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnimation, {
            toValue: 5,
            duration: 400,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnimation, {
            toValue: 0,
            duration: 400,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnimation, {
            toValue: -5,
            duration: 400,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnimation, {
            toValue: 0,
            duration: 400,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    floatUpAndDown();

    return () => {
      floatAnimation.stopAnimation();
    };
  }, [floatAnimation]);

  const fetchData = (location) => {
    setLoading(true);
    const lat = location.coords.latitude;
    const lon = location.coords.longitude;
    // console.log(lat + " and " + lon);

    const key = "fca456536ed53ec2a1d85f83de42c884";
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`
    )
      .then((response) => response.json()) // Convert the response to JSON
      .then((data) => {
        // console.log(data);
        setData(data);
        filterUniqueDays(data.list);

        const dtTxt = data.list[0].dt_txt;
        const dateTime = new Date(dtTxt);
        const hour = dateTime.getHours();

        const isNight = hour >= 18;

        if (isNight) {
          setNight(true);
        } else {
          setNight(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  };

  const filterUniqueDays = (list) => {
    const uniqueDaysMap = {};
    list.forEach((entry) => {
      const date = entry.dt_txt.split(" ")[0];
      if (!uniqueDaysMap[date]) {
        uniqueDaysMap[date] = entry;
      }
    });

    const uniqueDaysArray = Object.values(uniqueDaysMap);
    // console.log(uniqueDaysArray);
    setDaysData(uniqueDaysArray);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log("location: " + location);
      fetchData(location);
    })();
  }, []);

  const formatDate = (date) => {
    const inpDate = new Date(date);

    const options = { year: "numeric", month: "long", day: "numeric" };
    return inpDate.toLocaleDateString("en-US", options);
  };

  const formatTemp = (temp) => {
    return (temp - 273.15).toFixed(1);
  };

  const getTime = () => {
    const dtTxt = daysData[0].dt_txt;
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

  if (loading) {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: height,
        }}
      >
        <Image
          source={loadingImg}
          style={{ width: 300, height: 300, resizeMode: "contain" }}
        />
        <Text>Loading</Text>
      </View>
    );
  }

  return (
    <ScrollView style={night && styles.dark}>
      <View style={styles.locationBox}>
        <Text style={night ? [styles.date, styles.nightText] : styles.date}>
          {formatDate(data?.list[0].dt_txt)}
        </Text>
        <Text
          style={night ? [styles.location, styles.nightText] : styles.location}
        >
          {data?.city.name}
        </Text>
      </View>
      <View style={styles.tempBox}>
        <View style={styles.center}>
          <Animated.Image
            source={getImage(daysData[0]?.weather[0].main)}
            style={[
              styles.img,
              { transform: [{ translateY: floatAnimation }] },
            ]}
          />
        </View>
        <View style={styles.text}>
          <Text style={night ? [styles.temp, styles.nightText] : styles.temp}>
            {formatTemp(daysData[0]?.main.temp)}°
          </Text>
          <Text style={styles.feels}>{daysData[0]?.weather[0].main}</Text>
        </View>
      </View>

      <View>
        {daysData?.map((item, index) => (
          <Card key={index} data={item} night={night} />
        ))}
      </View>

      <View style={styles.blank}></View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  dark: {
    backgroundColor: "#111827",
  },
  locationBox: {
    padding: 32,
  },
  date: {
    fontWeight: "200",
    fontSize: 18,
  },
  location: {
    fontWeight: "900",
    fontSize: width * 0.1,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: 300,
    height: 300,
    aspectRatio: 1,
    resizeMode: "contain",
  },
  text: {
    paddingHorizontal: 32,
    paddingVertical: 18,
  },
  temp: {
    fontSize: 100,
    fontWeight: "900",
  },
  feels: {
    fontSize: 24,
    fontWeight: "500",
    color: "#FF8E27",
  },
  blank: {
    height: 32,
  },
  nightText: {
    color: "#fff",
  },
});
