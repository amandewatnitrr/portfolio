import { MdSensors } from "react-icons/md";
import { TbApi } from "react-icons/tb";
import {
  SiArduino,
  SiRaspberrypi,
  SiFirebase,
  SiSqlite,
  SiPython,
  SiDjango,
  SiWolframmathematica,
  SiBlender,
  SiReact,
  SiGnubash,
  SiLinux,
  SiDocker,
  SiGit,
  SiJavascript,
} from "react-icons/si";

import sanjeevani from "../Assets/Projects/sanjeevani.gif";
import django_tut from "../Assets/Projects/Screenshot 2023-04-25 at 4.49.35 PM.png";
import expressiondiff from "../Assets/Projects/expressiondiff.png";
import imhm from "../Assets/Projects/imhm.png";
import logitraffic from "../Assets/Projects/Logitraffic_Dashboard.png";
import hackingTutorial from "../Assets/Projects/hacking-tutorial.gif";
import reactTutorial from "../Assets/Projects/react-tutorial.gif";

export const projects = [
  {
    id: 1,
    title: "Hacking Tutorial",
    des: "An ethics-first, hands-on tutorial series for ethical hacking and penetration testing built for labs you control. Covers network reconnaissance, MITM and ARP spoofing, SQL injection fundamentals, password/hash cracking, and Python scripting for security automation, alongside binary exploitation and secure coding basics.",
    img: hackingTutorial,
    iconLists: [SiPython, SiGnubash, SiLinux, SiDocker, SiGit],
    link: "",
    sourceCode: "https://github.com/amandewatnitrr/hacking-tutorial",
  },
  {
    id: 2,
    title: "Expression Difference",
    des: "The Purpose of the Project is to design a function that tells difference between two given expressions and denotes the changes that need to be made to reference expression(expr_1) to make it appear same as another expression (expr_2) and produce the same evaluation. The approach involves visualizing these expressions as trees and record these differences in expression as a list of “Insert”, “Delete” and “ReplacePart” operations which on being applied to reference expression(expr_1) results in the other expression(expr_2). The Problem of identifying Differences in Expressions has a very large scale application, as working with large expressions in Wolfram can make code look messy. Any piece of code should be able to clearly demonstrate what it's doing and should be clearly distinguishable. The ExpressionDifference Function does the same. It clearly demonstrates how one expression can be converted into other expression with the use of Insert, ReplacePart and Delete operations. We explored that while working with expressions in Wolfram, sometime it becomes difficult to point out the differences between 2 expressions. Hence, ExpressionDifference solves this problem.",
    img: expressiondiff,
    iconLists: [SiWolframmathematica],
    link: "https://community.wolfram.com/groups/-/m/t/2312810?p_p_auth=c4MKy4iP",
    sourceCode:
      "https://community.wolfram.com/groups/-/m/t/2312810?p_p_auth=c4MKy4iP",
  },
  {
    id: 3,
    title: "DevSearch",
    des: "A Platform where Software Developer can share there projects on a platform and get reviews on it from other developers. The Developers can also showcase about there skills over there profile. They can also contact each other via message feature.",
    img: django_tut,
    iconLists: [SiPython, SiDjango, TbApi],
    link: "",
    sourceCode: "https://github.com/amandewatnitrr/django-tutorial",
  },
  {
    id: 4,
    title: "Sanjeevani",
    des: "Sanjeevani is an IoT web-based Real-Time Health Monitoring and Medical Consultation System. The IoT system connects to the cloud that lets the authenticated person keep a real-time check on some basic parameters like Heart-Rate, Blood Pressure, Temperature, ECG Function, Glucose Level, Dissolved Oxygen Level, etc. Using Bio-Sensors and Microprocessor that transmits the data to Firebase and Udibots for storage in the database and henceforth is accessible by the authenticated person(doctor and the user).",
    img: sanjeevani,
    iconLists: [MdSensors, SiArduino, SiRaspberrypi, SiFirebase, SiSqlite],
    link: "",
    sourceCode:
      "https://github.com/amandewatnitrr/Team-X_HealthCare-Sanjeevani",
  },
  {
    id: 5,
    title: "React Tutorial",
    des: "A progressive React learning repository walking through fundamentals across five numbered tutorial modules, each with its own chapter documentation, plus a Dockerised setup and a deployed live demo on Vercel.",
    img: reactTutorial,
    iconLists: [SiReact, SiJavascript, SiDocker, SiGit],
    link: "https://react-tutorial-ashy.vercel.app",
    sourceCode: "https://github.com/amandewatnitrr/React-tutorial",
  },
  {
    id: 6,
    title: "i-MHM",
    des: "i-MHM is an ML/IoT based Real-Time Mental Health Monitoring and Consultation System. The IoT system connects to the cloud that lets the authenticated person keep a real-time check on some basic parameters like ECG, body posture etc. Using Bio-Sensors and Microprocessor that transmits the data to Firebase for storage in the database and henceforth is accessible by the authenticated person(Parents and Counsellor). The app offers people better access to healthcare support beyond their bounds of convenience and connects them to doctors, specialists and healthcare experts on a digital platform, which provides them access to an online expert without a physical visit. For counsellors and parents, it includes a feature to view-track the medical record of the pupil regularly and efficiently.",
    img: imhm,
    iconLists: [
      MdSensors,
      SiArduino,
      SiRaspberrypi,
      SiFirebase,
      SiSqlite,
      SiBlender,
    ],
    link: "",
    sourceCode: "https://github.com/amandewatnitrr/codeutsava",
  },
  {
    id: 7,
    title: "Logitraffic",
    des: "LogiTraffic is an IoT based Deep Learning Powered Traffic Management and Theft Detection Solution. It’s an online website platform using which user can keep check on certain real-time parameters associated with the vehicle which includes fuel-level, GPS location, Brake System Temperature, Speed, Traffic Forecasting using Vehicle Detection and obtaining vehicle count through different road nodes and predicting Traffic Congestion/Jams. In case the user suspects his/her car has been stolen by logging in using the credentials one can lock the vehicles and see driver’s real time video stream and a picture of the driver is downloaded on the system so that it can be used for further investigation and police cases. (YouTube Video Presentation by Team Aztecs: https://youtu.be/rP2OGjZJ5NY) – Presented in E-Ujjwala Hackathon 2020 by Birsa Institute of Technology, Jharkhand (Team Aztecs - Finalists)",
    img: logitraffic,
    iconLists: [
      SiReact,
      SiDjango,
      MdSensors,
      SiArduino,
      SiRaspberrypi,
      SiFirebase,
      SiSqlite,
      SiBlender,
    ],
    link: "",
    sourceCode: "https://github.com/amandewatnitrr/Aztecs-LogiTraffic",
  },
];

export function getVisitLink(project) {
  return project.link && project.link.trim() !== ""
    ? project.link
    : project.sourceCode;
}
