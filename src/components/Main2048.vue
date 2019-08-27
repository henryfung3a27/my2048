<template>
  <div class="main2048">
    <h1>Welcome to 2048!</h1>
    <h3 style="text-align: center">Round {{ this.roundNumber }}</h3>
    <h1 v-if="isGameOver" style="text-align: center; font-size: 1.8em">Game Over!!</h1>
    <button class="board"
            v-on:keyup.left="keyleft"
            v-on:keyup.right="keyright"
            v-on:keyup.up="keyup"
            v-on:keyup.down="keydown"
            v-on:keyup.r="reset">
      <div v-for="n in this.oNumbers"
            :key="n.pos + '-label'">
        <span v-if="n.value !== 0"
              class="element"
              v-bind:class="elementStyle(n.value)">
          {{ n.value }}
        </span>
        <span v-else class="element"></span>
      </div>
    </button>
    <button @click="reset">Reset</button>
  </div>
</template>

<script>
export default {
  name: 'main2048',
  data () {
    return {
      numbers: [],
      roundNumber: 0,
      // The board is size * size
      size: 4,
      // The frequencies of each element, in form of {value, freq}
      elementOccurance: [],
      // The largest number occured
      largestElement: 2,
      isGameOver: false
    }
  },
  mounted () {
    this.initBoard()
  },
  computed: {
    oNumbers () {
      var r = []
      for (var k = 0; k < 16; k++) {
        r.push({
          value: this.numbers[k],
          pos: k
        })
      }
      return r
    }
  },
  methods: {
    initBoard () {
      this.numbers = Array(this.size * this.size).fill(0)
      this.isGameOver = false
      this.elementOccurance = [{value: 2, freq: 0}]
      this.largestElement = 2

      var initFillElements = 3
      for (var i = 0; i < initFillElements; i++) {
        this.generateNewElement()
      }

      this.roundNumber = 1
    },
    findEmptyIndexes (arr, n) {
      var indexes = []
      n *= n
      for (var i = 0; i < n; i++) {
        if (arr[i] === 0) {
          indexes.push(i)
        }
      }
      return indexes
    },
    addNewOccurance (n) {
      // If n == 0, we return it immediately since it is not a valid element
      if (n === 0) {
        return 0
      }
      if (n > this.largestElement) {
        this.elementOccurance.push({
          value: n,
          freq: 1
        })
        this.largestElement = n
      } else {
        // Since all elements are powers of 2
        var index = Math.log2(n) - 1
        try {
          if (this.elementOccurance[index].value === n) {
            this.elementOccurance[index].freq += 1
          }
        } catch (err) {
          alert('Error: see log')
          console.log(`[Error] @addNewOccurance elementOccurance[${index}] !== ${n}`)
          console.log(`[Error] n=${n} largestElement=${this.largestElement}`)
          for (var i = 0; i < this.elementOccurance.length; i++) {
            var t = this.elementOccurance[i]
            console.log(`[*] elementOccurance[${i}]={val: ${t.value}, freq: ${t.freq}}`)
          }
        }
      }

      return n
    },
    generateNewElement () {
      // Array contains indexes of empty cells
      var candidateIndex = this.findEmptyIndexes(this.numbers, this.size)
      // The number to generate
      var generateNumber = -1

      // If there is no more empty cells
      if (!candidateIndex || !candidateIndex.length) {
        this.isGameOver = true
        return
      }

      // Create frequency table and their intervals
      var freqSum = 0
      var freqTable = []

      this.elementOccurance.forEach(e => {
        freqSum += e.freq
        freqTable.push(freqSum)
      })

      // Random a number k and see which interval in frequency table contains k
      var k = Math.floor(Math.random() * freqSum)

      for (const [index, e] of freqTable.entries()) {
        if (k <= e) {
          generateNumber = this.elementOccurance[index].value
          break
        }
      }

      if (generateNumber === -1) {
        console.log(`[Error] @generate The number to spawn (${generateNumber}) is abnormal...`)
        alert('Warning, see log')
        generateNumber = 2
      }

      // Increment the frequency of generateNumber by 1
      try {
        this.elementOccurance[Math.log2(generateNumber) - 1].freq += 1
      } catch (err) {
        this.elementOccurance.push({value: generateNumber, freq: 1})
      }

      // Pick random cell to spawn
      var cellToSpawn = Math.floor(Math.random() * candidateIndex.length)
      this.$set(this.numbers, candidateIndex[cellToSpawn], generateNumber)

      this.roundNumber += 1
    },
    /*
      squeeze will do the squeezing when pressed arrow keys
      It pushes elements in the array to the left
      Example: [2, 4, 4, 2] -> [2, 8, 2, 0]

      @param arr An array of 4 integers
      @return An array of 4 integers squeezed to the left
    */
    squeeze (arr) {
      if (arr.length !== 4) {
        console.log(`[Error] @squeeze arr length not equal to 4: ${arr}`)
        alert('Error: see log')
      }

      // Array to return
      var r = []
      // Flag to monitor changes
      var changed = false

      // Trim all zeroes at the front, i.e. [4,0,2,2] => [4,2,2,0]
      var k = 0
      for (var i = 0; i < 4; i++) {
        if (arr[i] !== 0) {
          arr[k++] = arr[i]
        }
      }
      while (k < 4) {
        arr[k++] = 0
        changed = true
      }

      // if arr[0] == arr[1]
      if (arr[0] === arr[1]) {
        r.push(this.addNewOccurance(arr[0] * 2))
        // if arr[2] == arr[3]
        if (arr[2] === arr[3]) {
          r.push(this.addNewOccurance(arr[2] * 2))
          r.push(0)
          r.push(0)
        } else {
          r.push(arr[2])
          r.push(arr[3])
          r.push(0)
        }
        changed = true
      // if arr[1] == arr[2]
      } else if (arr[1] === arr[2]) {
        r.push(arr[0])
        r.push(this.addNewOccurance(arr[1] * 2))
        r.push(arr[3])
        r.push(0)
        changed = true
      // if arr[2] == arr[3]
      } else if (arr[2] === arr[3]) {
        r.push(arr[0])
        r.push(arr[1])
        r.push(this.addNewOccurance(arr[2] * 2))
        r.push(0)
        changed = true
      // nothing to squeeze
      } else {
        return arr
      }

      return (r, changed)
    },
    reset () {
      this.initBoard()
    },
    keyleft () {
      var split = []
      var update = []

      // Group this.numbers into 4 parts
      for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
          split.push(this.numbers[4 * i + j])
        }
        update = update.concat(this.squeeze(split))
        split = []
      }

      this.numbers = update
      this.generateNewElement()
    },
    keyright () {
      var split = []
      var update = []

      // Group this.numbers into 4 parts
      for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
          split.push(this.numbers[(4 * i) + 3 - j])
        }
        update = update.concat(this.squeeze(split).reverse())
        split = []
      }

      this.numbers = update
      this.generateNewElement()
    },
    keyup () {
      var split = []
      var update = []

      // Group this.numbers into 4 parts
      for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
          split.push(this.numbers[(i + j * 4)])
        }
        update = update.concat(this.squeeze(split))
        split = []
      }

      // Take the transpose of the result
      this.numbers = this.transpose(update)
      this.generateNewElement()
    },
    keydown () {
      var split = []
      var update = []

      // Transpose this.numbers first
      this.numbers = this.transpose(this.numbers)

      // Group this.numbers into 4 parts
      for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
          split.push(this.numbers[(4 * i) + 3 - j])
        }
        update = update.concat(this.squeeze(split))
        split = []
      }

      // Transpose the result
      split = this.transpose(update)
      var k = 0

      /*
        split becomes [12 13 14 15
                        8  9 10 11
                        4  5  6  7
                        0  1  2  3]
        Below operation turns it back to [0 1 2 3 4 ...]
      */
      for (i = 3; i >= 0; i--) {
        for (j = 0; j < 4; j++) {
          update[k] = split[(4 * i) + j]
          ++k
        }
      }

      this.numbers = update
      this.generateNewElement()
    },
    // Returns the class of an element, where each class has different background colour
    elementStyle (n) {
      if (n > 8192) {
        return 'numElementOther'
      }
      return `numElement${n}`
    },
    // Returns the transpose of a 4*4 1D-array
    transpose (arr) {
      var ret = []
      ret[0] = arr[0]
      ret[1] = arr[4]
      ret[2] = arr[8]
      ret[3] = arr[12]
      ret[4] = arr[1]
      ret[5] = arr[5]
      ret[6] = arr[9]
      ret[7] = arr[13]
      ret[8] = arr[2]
      ret[9] = arr[6]
      ret[10] = arr[10]
      ret[11] = arr[14]
      ret[12] = arr[3]
      ret[13] = arr[7]
      ret[14] = arr[11]
      ret[15] = arr[15]
      return ret
    }
  }
}
</script>

<style scoped>
.main2048 {
  background: #ccc;
}
button.board {
  margin: 0 auto;
  width: 500px;
  height: 500px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 4;
  background: #eee;
}
.element {
  border: 1px solid #555;
  display: flex;
  justify-content: center;
  align-items: center;
  block-size: 50px;
  max-width: 50px;
  max-height: 50px;
  padding: 5px 5px;
  margin: 10px 10px;
  font-size: 1.2em;
  font-weight: bold;
}
.numElement2 {
  background: rgb(255, 150, 150);
}
.numElement4 {
  background: rgb(128, 226, 119);
}
.numElement8 {
  background: rgb(219, 163, 117);
}
.numElement16 {
  background: rgb(255, 197, 120);
}
.numElement32 {
  background: rgb(114, 235, 229);
}
.numElement64 {
  background: rgb(226, 99, 188);
}
.numElement128 {
  background: rgb(51, 209, 104);
}
.numElement256 {
  background: rgb(255, 80, 130);
}
.numElement512 {
  background: rgb(233, 196, 76);
}
.numElement1024 {
  background: rgb(60, 177, 255);
}
.numElement2048 {
  background: rgb(223, 91, 113);
}
.numElement4096 {
  background: rgb(75, 160, 18);
}
.numElement8192 {
  background: rgb(74, 155, 175);
}
.numElementOther {
  background: rgb(145, 255, 191);
}
</style>
