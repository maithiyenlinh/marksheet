const userName = document.getElementById("name");
const mathScore = document.getElementById("math-score");
const physScore = document.getElementById("physics-score");
const chemScore = document.getElementById("chemistry-score");
const submitBtn = document.getElementById("submit");

const markSheet = document.getElementById("marksheet").getElementsByTagName('tbody')[0];

const averageBtn = document.getElementById("average");
const resultBtn = document.getElementById("result");


let countStudent = 0;
let rowIndex = 0;
let selectedRow = null;

const testScore = {
    name: "",
    math: 0,
    physical: 0,
    chemistry: 0
}

// check score each subject to confirm not any score is invalid (empty, not number or <0 and >10)
function checkScore(...elements) {
    const validResult = elements.map(element => {
        if(!element.value.trim() || isNaN(element.value) || Number(element.value) < 0 || Number(element.value > 10)) {
            element.classList.add("is-invalid");
            return false;
        } else {
            element.classList.remove("is-invalid");
        }
        return true
    })
    return validResult.every(item => item)
}

// check valid all of input info
function validateInfo() {
    // check usernam input
    if(!userName.value.trim()) {
        userName.classList.add("is-invalid");
    } else {
        userName.classList.remove("is-invalid");
    }

    // check score
    const checkResult = checkScore(mathScore, physScore, chemScore);

    if (!userName.value.trim() || !checkResult) {
        return false
    }
    
    return true;
}

//add data for cell[index]
function insertForCell(row, index, data) {
    const cell = row.insertCell(index);
    cell.innerHTML = data;
}

//add a new row in table and put data for that row throught cells
function insertData(rowIndex, studentIndex, data) {
    const newRow = markSheet.insertRow(rowIndex - 1);
    insertForCell(newRow, 0, studentIndex);
    insertForCell(newRow, 1, data.name);
    insertForCell(newRow, 2, data.math);
    insertForCell(newRow, 3, data.physical);
    insertForCell(newRow, 4, data.chemistry);
    insertForCell(newRow, 5, "?");
    insertForCell(newRow, 6, "?");
    insertForCell(
        newRow, 
        7, 
        `
        <button type="button" class="btn btn-info" onClick="editHandle(this)">Update</button>
        <button type="button" class="btn btn-dark" onClick="deleteHandle(this)">Delete</button>
        `
    );
    newRow.childNodes[7].classList.add("d-grid", "gap-2", "d-md-block");
}

// handling when click update button: add data of that row for input box
function editHandle(element) {
    selectedRow = element.parentElement.parentElement;
    userName.value = selectedRow.cells[1].innerHTML;
    mathScore.value = selectedRow.cells[2].innerHTML;
    physScore.value = selectedRow.cells[3].innerHTML;
    chemScore.value = selectedRow.cells[4].innerHTML;
    submitBtn.innerText = "Lưu";
}

// update data for selected row
function updateData(data) {
    selectedRow.cells[1].innerHTML = data.name;
    selectedRow.cells[2].innerHTML = data.math;
    selectedRow.cells[3].innerHTML = data.physical;
    selectedRow.cells[4].innerHTML = data.chemistry;
    if(selectedRow.cells[5].innerHTML !== "?") {
        selectedRow.cells[5].innerHTML = calculatorAverageScore(selectedRow);
    }
    if(selectedRow.cells[6].innerHTML !== "?") {
        checkResult(selectedRow);
    }
}

// handling when click delete button
function deleteHandle(element) {
    if (confirm('Bạn có muốn xóa dữ liệu học sinh này không?')) {
        markSheet.deleteRow(element.parentElement.parentElement.rowIndex - 1);
        rowIndex--;
    }
}

// calculator average 
function calculatorAverageScore(student) {
    const math = Number(student.cells[2].innerHTML);
    const physical = Number(student.cells[3].innerHTML);
    const chemistry = Number(student.cells[4].innerHTML);
    const averageScore = (math + physical + chemistry) / 3;
    return averageScore.toFixed(1);
}

function checkResult(student) {
    const averageScore = Number(student.cells[5].innerHTML);
    if(averageScore >= 8) {
        student.cells[6].innerHTML = "Học sinh Giỏi";
        student.classList.add("btn-danger");
    } else {
        student.cells[6].innerHTML = "";
        student.classList.remove("btn-danger");
    }
}

submitBtn.onclick = event => {
    event.preventDefault();
    const isValid = validateInfo();
    if (isValid) {
        testScore.name = userName.value.trim();
        testScore.math = Number(mathScore.value.trim());
        testScore.physical = Number(physScore.value.trim());
        testScore.chemistry = Number(chemScore.value.trim());
        
        // empty value input
        userName.value = "";
        mathScore.value = "";
        physScore.value = "";
        chemScore.value = "";
        
        if(selectedRow === null) {
            countStudent++;
            rowIndex++;
            insertData(rowIndex, countStudent, testScore);
        } else {
            updateData(testScore);
            selectedRow = null;
            submitBtn.innerText = "Nhập";
        }
    }
}

averageBtn.onclick = () => {
    if (markSheet.childElementCount === 0) {
        alert('Vui lòng nhập dữ liệu để tính toán điểm trung bình');
    } else {
        const studentList = [...markSheet.childNodes];
        if(studentList.every(student => student.cells[5].innerHTML !== "?")) {
            alert('Toàn bộ học sinh đã được tính điểm trung bình');
        } else {
            markSheet.childNodes.forEach(student => {
                if(student.cells[5].innerHTML === "?") {
                    student.cells[5].innerHTML = calculatorAverageScore(student)
                }
            });
        }
    }
}

resultBtn.onclick = () => {
    if (markSheet.childElementCount === 0) {
        alert('Vui lòng nhập dữ liệu để xét kết quả');
    } else {
        const studentList = [...markSheet.childNodes];
        if(studentList.some(student => student.cells[5].innerHTML === "?")) {
            alert('Vui lòng tính điểm trung bình để xét kết quả');
        } else {
            if(studentList.every(student => student.cells[6].innerHTML !== "?")) {
                alert('Toàn bộ học sinh đã được xét kết quả');
            } else {
                markSheet.childNodes.forEach(student => {
                    if(student.cells[6].innerHTML === "?") {
                        checkResult(student)
                    }
                });
            }
        }
    }
}
