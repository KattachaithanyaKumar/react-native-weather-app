import {
  Image,
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

const img = require("../assets/day.png");

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const Home = () => {
  const floatAnimation = useRef(new Animated.Value(0)).current;

  const [data, setData] = useState(null);
  const [daysData, setDaysData] = useState(null);
  const [loading, setLoading] = useState(true);

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
    console.log(lat + " and " + lon);
    // fetchData();

    const key = "fca456536ed53ec2a1d85f83de42c884";
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`
    )
      .then((response) => response.json()) // Convert the response to JSON
      .then((data) => {
        console.log(data);
        setData(data);
        filterUniqueDays(data.list);
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
    console.log(uniqueDaysArray);
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
    // console.log(typeof temp);
    return (temp - 273.15).toFixed(1);
  };

  if (loading) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.locationBox}>
        <Text style={styles.date}>{formatDate(data?.list[0].dt_txt)}</Text>
        <Text style={styles.location}>{data?.city.name}</Text>
      </View>
      <View style={styles.tempBox}>
        <View style={styles.center}>
          <Animated.Image
            source={img}
            style={[
              styles.img,
              { transform: [{ translateY: floatAnimation }] },
            ]}
          />
        </View>
        <View style={styles.text}>
          <Text style={styles.temp}>{formatTemp(daysData[0]?.main.temp)}°</Text>
          <Text style={styles.feels}>Sunny</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  screen: {
    // flex: 1,
    // backgroundColor: "#1F2937",
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
});
