import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class ThreadBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      val: props.val
    }
  }

  render() {
    //first row
    if (this.props.num === 0 && (this.props.arrLen === 1 || this.props.arrLen === 0)) {
      let msg = this.props.val;
      if (this.props.val === "") {
        msg = "Start typing on the left!";
      }
      //if on mobile
      if (/Mobi/.test(navigator.userAgent)) {
        return (
          <div className="ThreadBox">
  
            <button onClick={() => { navigator.clipboard.writeText(msg) }} > Copy</button>
            <p>{msg}</p>
  
          </div>
        )
      }
      //if on desktop
      else {
        return (
          <div className="ThreadBox initThread">

            <button onClick={() => { navigator.clipboard.writeText(msg) }} > Copy</button>
            <p>{msg}</p>

          </div>
        )
      }
    }
    //not first row
    else {
      return (
        <div className="ThreadBox">

          <button onClick={() => { navigator.clipboard.writeText(this.props.val) }} > Copy</button>
          <p>{this.props.val}</p>

        </div>
      )
    }
  }

}

class TweetBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Type your tweet here!',

    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    event.preventDefault();
  }



  thread(l, s) {
    //primative verion of threadCutter, will cut off words
    l -= 8;
    const len = s.length;
    const boxes = Number(Math.ceil(len / l));
    let threads = [];
    for (let i = 0; i < boxes; i++) {
      if (i === boxes - 1) {
        threads.push(s.substring(i * l, s.length) + " (" + (i + 1) + "/" + boxes + ")");
      }
      else {
        threads.push(s.substring(i * l, i * l + l) + " (" + (i + 1) + "/" + boxes + ")");
      }
    }

    return threads;
  }

  threadCutter(l, s) {
    //working version. Prevents word cutoff
    l -= 8;
    const len = s.length;
    let boxes = Number(Math.ceil(len / l));
    let threads = [];
    let endChar = 0;


    for (let i = 0; i < boxes; i++) {
      let changed = false;
      let valid = true;
      let usedChar = l;
      const thresh = 10

      if (s.substring(endChar + usedChar, endChar + usedChar + 1) !== " ") {
        valid = false;
        // console.log(s.substring(endChar+usedChar,endChar+usedChar+1));
        for (let j = endChar + usedChar; j > endChar + usedChar - thresh; j--) {
          if (s.substring(j, j + 1) === " ") {
            usedChar = j - endChar;
            // console.log(usedChar)
            changed = true;
            break;
          }
        }

      }

      let msg = " (" + (i + 1) + "/" + boxes + ")";

      if (i !== boxes - 1 && !changed && !valid) {
        usedChar -= 1;
        msg = "- (" + (i + 1) + "/" + boxes + ")";
      }


      if (i === boxes - 1) {
        if (s[endChar + l] !== undefined) {
          console.log("hmm, error?")
          console.log(s[endChar + l]);
          boxes++;
          continue;
        }
        threads.push(s.substring(endChar, s.length) + msg);
      }
      else {
        threads.push(s.substring(endChar, endChar + usedChar) + msg);
      }

      endChar += usedChar;
    }

    return threads;
  }


  render() {
    const arr = this.threadCutter(280, this.state.value);

    const rendArr = []

    if (arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {

        rendArr.push(<ThreadBox key={i} val={arr[i]} num={i} arrLen={arr.length} />);
      }
    }
    else {
      rendArr.push(<ThreadBox key={0} val={""} num={0} arrLen={arr.length} />);
    }

    //mobile height adjustment. Perhaps calculate this per screen?     
    let box = <textarea value={this.state.value} onChange={this.handleChange} />;
    let colName1 = "col1";
    let colName2 = "col2";
    let boxMBottom = "-5px";
    let boxPLeft = "20px";
    if (/Mobi/.test(navigator.userAgent)) {
      box = <textarea value={this.state.value} onChange={this.handleChange} style={{minHeight:"250px",width:"100%",padding:"0",margin:'0'}}/>;
      boxMBottom = "0px";
      boxPLeft = "0px";
      colName1 = "column";
      colName2 = "column";
    }

    return (

      <div className="row">
        <div className={colName1} style={{ backgroundColor: "#1DA1F1" }}>
          <form >
            <label>
              <div style= {{color:"white",fontSize:"22px",paddingLeft:boxPLeft,marginBottom:boxMBottom,marginTop:"-5px"}}>Tweet:</div>
          {/* <textarea value={this.state.value} onChange={this.handleChange} /> */}
          {box}
            </label>

          </form>
        </div>
        <div className={colName2} style={{ backgroundColor: "#E1E8EE" }}>
          {rendArr}
        </div>
      </div>


    );
  }
}

ReactDOM.render(

  <TweetBox />,
  document.getElementById('root')
);


