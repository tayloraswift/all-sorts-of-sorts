import React from "react";
import "./SortingVisualiser.css";
import { performMergeSort } from "../Algos/mergeSort.js"
import { performSelectionSort } from "../Algos/selectionSort.js"
import { performInsertionSort } from "../Algos/insertionSort.js"
import { Navbar, Container, Button, Form, Row, InputGroup } from 'react-bootstrap';

const stickyColour = 250;
const green = "#90EE90";
const purple = "#BD8BDD";
const red = "#FF0000"

export default class SortingVisualiser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            valuesToSort: [],
            timeouts: [],
            barNumber: 100,
            delayInterval: 10,
        }
    };

    componentDidMount() {  // Once we successfully render this component in, this runs
        this.resetValues();
    };

    resetValues() {  // Gives us a fresh randomised array
        this.pause();
        const newValues = [];

        let numBars = document.getElementById("num-bars").value;
        if (numBars === "") {
            numBars = "50";
        }

        try {
            numBars = parseInt(numBars);
        }
        catch (e) {
            alert("You need to enter in a number");
            return;
        }

        numBars = Math.min(100, numBars);
        numBars = Math.max(0, numBars);

        for (let i = 0; i < numBars; i++) {
            // newValues.push(Math.floor(Math.random() * (500 - 5) + 5));  // Formula used for uniformly picking numbers between 4 and 500
            newValues.push(Math.floor(Math.random() * (90 - 5) + 5));
        }
        this.setState({
            valuesToSort: newValues
        });
    };



    pause() {
        // this.state.timeouts.forEach((id) => clearTimeout(id));
        for (let i = 0; i < this.state.timeouts.length; i++) {
            clearTimeout(this.state.timeouts[i]);
        }
        this.state.timeouts = [];
        const verticalBars = document.getElementsByClassName("vertical-bar");
        for (let i = 0; i < verticalBars.length; i++) {
            verticalBars[i].style.backgroundColor = purple;
        }
    }

    setDelayInterval() {
        let chosenInterval = document.getElementById("delay-interval").value;
        if (chosenInterval === "") {
            chosenInterval = "2.5";
        }

        try {
            chosenInterval = parseFloat(chosenInterval)
        }
        catch (e) {
            alert("You need to enter in a float");
            return;
        }

        this.state.delayInterval = chosenInterval;
    }

    runBeforeSort() {
        this.pause();
        this.setDelayInterval();
    }
    

    mergeSort() {
        this.runBeforeSort();
        const [colourChanges, heightChanges] = performMergeSort(this.state.valuesToSort);
        const n = colourChanges.length;  // Should be the same for height changes

        let delayMultiplier = 0;

        const verticalBars = document.getElementsByClassName("vertical-bar");

        for (let i = 0; i < n; i++) {
            const currBars = colourChanges[i];
            const barA = verticalBars[currBars[0]].style;
            const barB = verticalBars[currBars[1]].style;

            this.state.timeouts.push(setTimeout(() => {
                barA.backgroundColor = red;
                barB.backgroundColor = red;
            }, delayMultiplier * this.state.delayInterval));
            delayMultiplier += 2;

            this.state.timeouts.push(setTimeout(() => {
                barA.backgroundColor = purple;
                barB.backgroundColor = purple;
            }, delayMultiplier * this.state.delayInterval));
            delayMultiplier += 2;

            this.state.timeouts.push(setTimeout(() => {
                const [barToChange, newBarHeight] = heightChanges[i];
                const barStyle = verticalBars[barToChange].style;
                barStyle.height = `${newBarHeight}%`;
            }, delayMultiplier * this.state.delayInterval));
            delayMultiplier += 2;
        }
    };

    selectionSort() {
        this.runBeforeSort();
        const [colourChanges, heightChanges] = performSelectionSort(this.state.valuesToSort);
        const n = colourChanges.length;

        let delayMultiplier = 0;

        const verticalBars = document.getElementsByClassName("vertical-bar");

        for (let i = 0; i < n; i++) {
            const m = colourChanges[i].length;
            for (let j = 0; j < m - 1; j++) {
                const barStyle = verticalBars[colourChanges[i][j]].style;

                this.state.timeouts.push(setTimeout(() => {
                    barStyle.backgroundColor = red;
                }, delayMultiplier * this.state.delayInterval));
                delayMultiplier += 1;

                this.state.timeouts.push(setTimeout(() => {
                    barStyle.backgroundColor = purple;
                }, delayMultiplier * this.state.delayInterval));
                delayMultiplier += 1;
            }

            this.state.timeouts.push(setTimeout(() => {
                const [barA, barB, newBarAHeight, newBarBHeight] = heightChanges[i];
                const barAStyle = verticalBars[barA].style;
                barAStyle.height = `${newBarAHeight}%`;
                const barBStyle = verticalBars[barB].style; 
                barBStyle.height = `${newBarBHeight}%`;
                verticalBars[i].style.backgroundColor = green;
            }, delayMultiplier * this.state.delayInterval));
            delayMultiplier += 1;

            this.state.timeouts.push(setTimeout(() => {
                verticalBars[i].style.backgroundColor = purple;
            }, delayMultiplier * this.state.delayInterval + stickyColour));
            delayMultiplier += 1;
        }
    };

    insertionSort() {
        this.runBeforeSort();
        const [colourChanges, heightChanges] = performInsertionSort(this.state.valuesToSort);
        const n = colourChanges.length;

        let delayMultiplier = 0;

        const verticalBars = document.getElementsByClassName("vertical-bar");

        for (let i = 0; i < n; i++) {

            let currIterHeightChanges = heightChanges[i];
            let currIterColourChanges = colourChanges[i];

            let m = currIterHeightChanges.length;

            for (let j = 0; j < m; j++) {

                this.state.timeouts.push(setTimeout(() => {
                    const [barA, barB, newBarAHeight, newBarBHeight] = currIterHeightChanges[j];
                    const barAStyle = verticalBars[barA].style;
                    barAStyle.height = `${newBarAHeight}%`;
                    const barBStyle = verticalBars[barB].style;
                    barBStyle.height = `${newBarBHeight}%`;
                }, delayMultiplier * this.state.delayInterval));
                delayMultiplier += 1;

                let barStyle = verticalBars[currIterColourChanges[j]].style;

                if (j == m - 1) {
                    this.state.timeouts.push(setTimeout(() => {
                        barStyle.backgroundColor = green;
                    }, delayMultiplier * this.state.delayInterval));
                    delayMultiplier += 1;

                    this.state.timeouts.push(setTimeout(() => {
                        barStyle.backgroundColor = purple;
                    }, delayMultiplier * this.state.delayInterval + stickyColour));
                    delayMultiplier += 1;
                }
                else {
                    this.state.timeouts.push(setTimeout(() => {
                        barStyle.backgroundColor = red;
                    }, delayMultiplier * this.state.delayInterval));
                    delayMultiplier += 1;

                    this.state.timeouts.push(setTimeout(() => {
                        barStyle.backgroundColor = purple;
                    }, delayMultiplier * this.state.delayInterval));
                    delayMultiplier += 1;
                }

                this.state.timeouts.push(setTimeout(() => {
                    barStyle.backgroundColor = (j === m - 1) ? green : purple;
                }, delayMultiplier * this.state.delayInterval));
                delayMultiplier += 1;

                this.state.timeouts.push(setTimeout(() => {
                    barStyle.backgroundColor = purple;
                }, delayMultiplier * this.state.delayInterval + ((j === m - 1) ? stickyColour : 0)));
                delayMultiplier += 1;
                
            }
            
        }
    }

    render() {
        const values = this.state.valuesToSort;

        return (
            <div className="app-container">
                <Navbar bg="dark">
                    <Navbar.Brand><img className="logo" src="/logo_transparent_cropped.png" /></Navbar.Brand>
                    <Container className="overwrite-display-flex">
                        {/*<Form>
                            <Form.Control className="number-input" type="number" min="1" max="100" default-value="100" id="num-bars" placeholder="Number of Bars" />
                        </Form>*/}
                        <input type="number" className="number-input" min="1" max="100" id="num-bars" placeholder="Number of Bars" />
                        <Button className="sort-button" onClick={() => this.resetValues()}>New Values</Button>
                        <Button className="sort-button" onClick={() => this.mergeSort()}>Merge Sort</Button>
                        <Button className="sort-button" onClick={() => this.selectionSort()}>Selection Sort</Button>
                        <Button className="sort-button" onClick={() => this.insertionSort()}>Insertion Sort</Button>
                        <input type="number" className="number-input" min="1" max="2000" id="delay-interval" placeholder="Animation Speed" />
                        <Button className="sort-button" onClick={() => this.pause()}>Pause</Button>
                    </Container>
                </Navbar>
                <div className="bar-container">
                    {values.map((value, index) => 
                        <div className="vertical-bar" key={index} style={{height: `${value}%`}} />
                    )}
                    <div className="vertical-bar invisible invisible-bar" style={{height: "100%"}} />
                </div>
            </div>
        )
    };
}