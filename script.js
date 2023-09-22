
let inputSlider=document.querySelector(".slider");
let passwordLengthDisplay=document.querySelector(".number");
let circleColor=document.querySelector(".strength-circle");
let lowercaseCheckBox=document.querySelector("#lowercase");
let uppercaseCheckBox=document.querySelector("#uppercase");
let numberCheckBox=document.querySelector("#numbers");
let symbolCheckBox=document.querySelector("#symbols");
let copyMsg=document.querySelector("[data-copyMsg]");  // this is how you fetch any element by creating a CUSTOM ATTRIBUTE !!
let passwordDisplay=document.querySelector("[password-display]");
let passwordlength=document.querySelector(".password-length");
let copyBtn=document.querySelector("[copy-Btn]");
let allCheckBox = document.querySelectorAll("input[type=checkbox]");   //this is the syntax to get the list of all check boxes 
let generateBtn=document.querySelector(".generateBtn");

let password="";
let passwordLength=10;
let checkboxCount=0;
const symbols='~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
handleSlider();
setCircleColor("#ccc");

function handleSlider()
{
    inputSlider.value=passwordLength;
    passwordLengthDisplay.innerText=passwordLength;
    // do we need to add something else also 

}

// ab jaise jaise ham slider ko slide kare hame chahie ki hmaara password length jo display ho rha hai wo bhi change ho uske lie this is the code->

inputSlider.addEventListener('input',(event)=>{
    passwordLength=event.target.value; // event.target hamara slider ki value ko bataata hai. So event.target.value matlab haamaare passwrod lenght ko slider ki value ke equal kar do! aur fir handle slider function se UI par change kar do 
    handleSlider();

})




function setCircleColor(color)
{
    circleColor.style.backgroundColor=color;
    //shadow ka code 
    circleColor.style.boxShadow = `0px 0px 12px 1px ${color}`;

}

function getRandomInteger(min,max)
{
    return  Math.floor(Math.random() * (max - min)) + min ;

}
function generateRandomNumber()
{
    return getRandomInteger(0,10);
}
function generateLowerCase()
{
    return String.fromCharCode(getRandomInteger(97,123));
}

function generateUpperCase()
{
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbol()
{
    let num=getRandomInteger(0,symbols.length);
    return symbols.charAt(num);
}

function calcStrength()
{
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if (uppercaseCheckBox.checked) hasUpper = true;
    if (lowercaseCheckBox.checked) hasLower = true;
    if (numberCheckBox.checked) hasNum = true;
    if (symbolCheckBox.checked) hasSym = true;
    
    if(hasLower && hasUpper && (hasSym || hasNum) && passwordLength>=8) setCircleColor("#0f0");
    else if (hasSym && hasNum && passwordLength>=10)  setCircleColor("#ff0");
    else{
        setCircleColor("#f00");
    }

}

async function copyContent() // agar kisi function me await use karna hai to uske lie pehle us function ko async banaana padta hai 
{
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied!";

    }
    catch(e)
    {
        copyMsg.innerText="Failed";
    }
    copyMsg.classList.add="active";

    setTimeout(()=>{
        copyMsg.classList.remove="active";
    },2000);

}

//copy button par event listener to copy the password to the clipboard and show the text of clip copied 
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value) copyContent();
})

function handleCheckBoxChange()
{
    checkboxCount=0;
    allCheckBox.forEach(element => {
        if(element.checked) checkboxCount++;
    });

// special case when you have selected more checkboxes but password length usse choti select kar rkhi hai

if(passwordLength<checkboxCount)
{
    passwordLength=checkboxCount;
    handleSlider();
}

}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})


// ab aata hai main function i.e. generate password!
// this is the code to shuffle the password 

function shufflePassword(array) {
    //Fisher Yates Method
    //sabse pehle ek loop chalega last index se 
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        //koi bhi random index nikaala aur j me store kar lia 
        //next teen line swap karne ke lie hai ith aur randomly selected jth index ke element ko
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      //str me store kar lia password
    let str = "";
    array.forEach((char) => (str += char));
    return str;
}

function generatePassword()
{
    console.log("generate password called");
    // initialise the password
    password="";
    if(checkboxCount==0) return;
    if(passwordLength<checkboxCount)
    {
        passwordLength=checkboxCount;
        handleSlider();
    }
   
    let functionArr=[];
    if(uppercaseCheckBox.checked) functionArr.push(generateUpperCase);
    if(lowercaseCheckBox.checked) functionArr.push(generateLowerCase);
    if(numberCheckBox.checked) functionArr.push(generateRandomNumber);
    if(symbolCheckBox.checked) functionArr.push(generateSymbol);
     
    for(let i=0;i< functionArr.length;i++)
    {
        let randomIndex=Math.floor(Math.random()* (functionArr.length));
        password+=functionArr[randomIndex]();
    }
    console.log('password  with all compulsory is '+ password);
    console.log("compulsory check boxes symbols added in function array");
    for(let i=0;i<passwordLength-checkboxCount;i++)
    {
        let randomIndex=getRandomInteger(0,functionArr.length);
        password+=functionArr[randomIndex]();
    }
    console.log('password  with all compulsory is '+ password);
    console.log("remaining data added in the password");
    // now to shuffle the password, we have 
    password = shufflePassword(Array.from(password));
    console.log("shuffling done");
    console.log('password  with all compulsory is '+ password);
    passwordDisplay.value=password;
    console.log("password should be displayed");
    calcStrength();


}

generateBtn.addEventListener('click',generatePassword);