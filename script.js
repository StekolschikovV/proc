class Process {


    constructor() {
        this.is_cursor_on_process = false
        this.start_el_position = {
            top: 0,
            left: 0
        }
        this.cursor_position = {
            top: 0,
            left: 0
        }
        this.is_mouse_down = false


        this.temp_from = undefined
        this.temp_to = undefined
        this.arrow_array = []

        this.event()

        //test
        this.add_task('timeout', 'Задержка')
    }

    event() {
        document.querySelector('#btn-timeout').addEventListener('click', () => {
            this.add_task('timeout', 'Задержка')
        })
        document.querySelector('#btn-if').addEventListener('click', () => {
            this.add_task('if', 'Условие')
        })
        document.querySelector('#btn-add').addEventListener('click', () => {
            this.add_task('add', 'Добавление')
        })
        document.querySelector('#btn-rm').addEventListener('click', () => {
            this.add_task('rm', 'Удаленье')
        })
        $('*').mouseup(() => {
            if (this.is_cursor_on_process) {
                this.is_mouse_down = false
            } else {
                this.clear_temp()
                this.is_mouse_down = false
            }
            // this.clear_temp()
        })
        $('#process').mousedown(() => {
            if (this.is_cursor_on_process) {
                console.log('mousedown')
                this.is_mouse_down = true
            }else {
                this.is_mouse_down = true
            }
        })
        $('#process').mouseleave(() => {
            this.is_cursor_on_process = false
            this.clear_temp()
        })
        $('#process').mouseover(() => {
            this.is_cursor_on_process = true
        })
        $('#process').on("mousemove", (event) => {
            if (this.is_cursor_on_process) {
                // this.cursor_position = {
                //     left: event.offsetY,
                //     top: event.offsetX
                // }
                let process = document.querySelector('#process')
                var offsets = $('#process').offset();

                // console.log(process)
                this.cursor_position = {
                    left: event.pageY - offsets.top,
                    top: event.pageX - offsets.left
                }
                this.draw_arrow()
            }
        })
    }

    add_task(type, title) {
        let date = Date.now()

        let new_task_block = document.createElement('div')
        new_task_block.classList.add('task')
        new_task_block.setAttribute('data-id', date)
        new_task_block.innerText = title
        new_task_block.setAttribute('data-type', type)
        $(new_task_block).draggable({containment: "parent", scroll: false, cancel: '.norm, .err, .ok'})
        $(new_task_block).mousedown(() => {
            this.temp_to = new_task_block.dataset.id
            this.add_arrow()
        })
        document.querySelector('#process').appendChild(new_task_block)

        // type - norm, ok, err
        let norm = document.createElement('div')
        norm.setAttribute('data-target', '')
        norm.setAttribute('data-id', date + 'n')
        norm.classList.add('norm')
        $(norm).mousedown(() => {
            console.log(norm.dataset.id)
            this.temp_from = norm.dataset.id
            this.add_arrow()
        })

        new_task_block.appendChild(norm)
        let ok = document.createElement('div')
        ok.setAttribute('data-target', '')
        ok.setAttribute('data-id', date + 'o')
        ok.classList.add('ok')
        $(ok).mousedown(() => {
            this.temp_from = ok.dataset.id
            this.add_arrow()
        })

        new_task_block.appendChild(ok)
        let err = document.createElement('div')
        err.setAttribute('data-id', date + 'e')
        err.setAttribute('data-target', '')
        err.classList.add('err')
        new_task_block.appendChild(err)
        $(err).mousedown(() => {
            this.temp_from = err.dataset.id
            this.add_arrow()
        })

    }

    draw_arrow(){

        document.querySelector('#p').innerHTML = ''

        for(let i = 0; i < this.arrow_array.length; i++){
            let from = document.querySelector(`[data-id="${this.arrow_array[i].split('-')[0]}"]`)
            let from_parent =  from.parentNode
            let to = document.querySelector(`[data-id="${this.arrow_array[i].split('-')[1]}"]`)

            var newLine = document.createElementNS('http://www.w3.org/2000/svg','path');
            $("svg g").append(newLine);

            var position_from = {
                x: from_parent.offsetLeft + from_parent.offsetWidth + 25,
                y: from_parent.offsetTop + from.offsetTop + from.offsetHeight / 2
            };

            var position_to = {
                x: to.offsetLeft + 5,
                y: to.offsetTop + to.offsetHeight / 2
            };

            var dStrLeft = "M" + (position_from.x) + "," + (position_from.y) + " " + "C" + (position_from.x + 100) + "," + (position_from.y) + " " + (position_to.x - 100) + "," + (position_to.y) + " " + (position_to.x) + "," + (position_to.y);
            newLine.setAttribute("d", dStrLeft);

        }


        if(this.temp_from){

            let from = document.querySelector(`[data-id="${this.temp_from}"]`)
            let from_parent =  from.parentNode
            // console.log(from_parent)
            var newLine = document.createElementNS('http://www.w3.org/2000/svg','path');
            $("svg g").append(newLine);
            var position_from = {
                x: from_parent.offsetLeft + from_parent.offsetWidth + 25,
                y: from_parent.offsetTop + from.offsetTop + from.offsetHeight / 2
            };

            var position_to = {
                x: this.cursor_position.top,
                y: this.cursor_position.left
            };
            // console.log('1)', this.cursor_position.top)
            // console.log('2)', position_from.x)

            var dStrLeft = "M" + (position_from.x) + "," + (position_from.y) + " " + "C" + (position_from.x + 100) + "," + (position_from.y) + " " + (position_to.x - 100) + "," + (position_to.y) + " " + (position_to.x) + "," + (position_to.y);
            newLine.setAttribute("d", dStrLeft);
        } else {
            document.body.style.background = 'white'
        }

    }

    add_arrow(){
        if(
            this.temp_from && this.temp_to
            && this.temp_to.search('n') == -1 && this.temp_to.search('o') == -1 && this.temp_to.search('e') == -1
            && this.temp_to !== this.temp_from
            && this.temp_from.search(this.temp_to) == -1
        ){
            // rm old
            let rm_id = undefined
            for(let i = 0; i < this.arrow_array.length; i++){
                let el = this.arrow_array[i]
                let el0 = el.split('-')[0]
                if(this.temp_from == el0){
                    rm_id = i
                }
            }
            if(rm_id != undefined){
                this.arrow_array.splice(rm_id, 1);
            }
            // add new
            let str = `${this.temp_from}-${this.temp_to}`
            if(!this.arrow_array.includes(str)){
                this.arrow_array.push(`${this.temp_from}-${this.temp_to}`)
                this.clear_temp()
            }
        }


    }

    clear_temp(){
        this.temp_from = undefined
        this.temp_to = undefined
    }

}

new Process()