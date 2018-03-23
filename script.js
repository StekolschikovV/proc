jQuery.fn.deserialize = function (data) {
    var f = this,
        map = {},
        find = function (selector) {
            return f.is("form") ? f.find(selector) : f.filter(selector);
        };
    //Get map of values
    jQuery.each(data.split("&"), function () {
        var nv = this.split("="),
            n = decodeURIComponent(nv[0]),
            v = nv.length > 1 ? decodeURIComponent(nv[1]) : null;
        if (!(n in map)) {
            map[n] = [];
        }
        v = v.split('+').join(' ')
        map[n].push(v);
    })


    //Set values for all form elements in the data
    jQuery.each(map, function (n, v) {
        find("[name='" + n + "']").val(v);
    })
    //Clear all form elements not in form data
    find("input:text,select,textarea").each(function () {
        if (!(jQuery(this).attr("name") in map)) {
            jQuery(this).val("");
        }
    })
    find("input:checkbox:checked,input:radio:checked").each(function () {
        if (!(jQuery(this).attr("name") in map)) {
            this.checked = false;
        }
    })
    return this;
};


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
        this.add_task('start', 'Начало работы')
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
        document.querySelector('#btn-mailing').addEventListener('click', () => {
            this.add_task('mailing', 'Отправка рассылки')
    })
        document.querySelector('#btn-proc').addEventListener('click', () => {
            this.add_task('proc', 'Дочерний процесс')
    })
        $('*').mouseup(() => {
            if (this.is_cursor_on_process) {
            this.is_mouse_down = false
        } else {
            this.clear_temp()
            this.is_mouse_down = false
        }
    })
        $('#process').mousedown(() => {
            if (this.is_cursor_on_process) {
            console.log('mousedown')
            this.is_mouse_down = true
        } else {
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
            let process = document.querySelector('#process')
            var offsets = $('#process').offset();
            this.cursor_position = {
                left: event.pageY - offsets.top,
                top: event.pageX - offsets.left
            }
            this.draw_arrow()
        }
    })
    }

    add_task(type, title, id, style, form) {

        let date = Date.now()
        if (id)
            date = id

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
        $(new_task_block).dblclick((e) => {
            modal.open_modal(new_task_block)
    })
        if (style) {
            new_task_block.style.top = style.top
            new_task_block.style.left = style.left
        }
        if (form) {
            new_task_block.setAttribute('data-form', form)
        }
        document.querySelector('#process').appendChild(new_task_block)

        // type - norm
        let norm = document.createElement('div')
        // norm.setAttribute('data-target', '')
        norm.setAttribute('data-id', date + 'n')
        norm.classList.add('norm')
        $(norm).mousedown(() => {
            console.log(norm.dataset.id)
        this.temp_from = norm.dataset.id
        this.add_arrow()
    })
        new_task_block.appendChild(norm)
        // type - ok
        let ok = document.createElement('div')
        ok.setAttribute('data-id', date + 'o')
        ok.classList.add('ok')
        $(ok).mousedown(() => {
            this.temp_from = ok.dataset.id
        this.add_arrow()
    })
        new_task_block.appendChild(ok)
        // type - err
        let err = document.createElement('div')
        err.setAttribute('data-id', date + 'e')
        err.classList.add('err')
        $(err).mousedown(() => {
            this.temp_from = err.dataset.id
        this.add_arrow()
    })
        new_task_block.appendChild(err)

    }

    draw_arrow() {

        document.querySelector('#p').innerHTML = ''

        for (let i = 0; i < this.arrow_array.length; i++) {
            try {
                let from = document.querySelector(`[data-id="${this.arrow_array[i].split('-')[0]}"]`)
                let from_parent = from.parentNode
                let to = document.querySelector(`[data-id="${this.arrow_array[i].split('-')[1]}"]`)
                try {
                    if (to.dataset.type !== 'start') {
                        let newLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        $("svg g").append(newLine);

                        let position_from = {
                            x: from_parent.offsetLeft + from_parent.offsetWidth + 25,
                            y: from_parent.offsetTop + from.offsetTop + from.offsetHeight / 2
                        }

                        let position_to = {
                            x: to.offsetLeft + 5,
                            y: to.offsetTop + to.offsetHeight / 2
                        }

                        var dStrLeft = "M" + (position_from.x) + "," + (position_from.y) + " " + "C" + (position_from.x + 100) + "," + (position_from.y) + " " + (position_to.x - 100) + "," + (position_to.y) + " " + (position_to.x) + "," + (position_to.y);
                        newLine.setAttribute("d", dStrLeft);
                    }
                } catch (e) {}
            } catch (e) {

                let from = document.querySelector(`[data-id="${this.arrow_array[i].split('-')[0]}"]`)

                console.log(this.arrow_array[i], this.arrow_array[i].split('-')[0])
                console.log(from)
            }

        }


        if (this.temp_from) {

            let from = document.querySelector(`[data-id="${this.temp_from}"]`)
            let from_parent = from.parentNode

            var newLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            $("svg g").append(newLine);
            var position_from = {
                x: from_parent.offsetLeft + from_parent.offsetWidth + 25,
                y: from_parent.offsetTop + from.offsetTop + from.offsetHeight / 2
            }

            var position_to = {
                x: this.cursor_position.top,
                y: this.cursor_position.left
            }

            var dStrLeft = "M" + (position_from.x) + "," + (position_from.y) + " " + "C" + (position_from.x + 100) + "," + (position_from.y) + " " + (position_to.x - 100) + "," + (position_to.y) + " " + (position_to.x) + "," + (position_to.y);
            newLine.setAttribute("d", dStrLeft);
        } else {
            document.body.style.background = 'white'
        }

    }

    add_arrow() {
        if (
            this.temp_from && this.temp_to
            && this.temp_to.search('n') == -1 && this.temp_to.search('o') == -1 && this.temp_to.search('e') == -1
            && this.temp_to !== this.temp_from
            && this.temp_from.search(this.temp_to) == -1
        ) {
            // rm old
            let rm_id = undefined
            for (let i = 0; i < this.arrow_array.length; i++) {
                let el = this.arrow_array[i]
                let el0 = el.split('-')[0]
                if (this.temp_from == el0) {
                    rm_id = i
                }
            }
            if (rm_id != undefined) {
                this.arrow_array.splice(rm_id, 1);
            }
            // add new
            let str = `${this.temp_from}-${this.temp_to}`
            if (!this.arrow_array.includes(str)) {
                this.arrow_array.push(`${this.temp_from}-${this.temp_to}`)
                this.clear_temp()
            }
        }


    }

    clear_temp() {
        this.temp_from = undefined
        this.temp_to = undefined
    }

    load_result() {
        this.arrow_array = []
        document.querySelector('#process').innerHTML = ''
        let res = JSON.parse(document.querySelector('#result').value)
        for (let i = 0; i < res.length; i++) {
            // this.arrow_array =
            if (res[i].norm_target != '') {
                this.arrow_array.push(res[i].norm_target)
            }
            if (res[i].ok_target != '') {
                this.arrow_array.push(res[i].ok_target)
            }
            if (res[i].err_target != '') {
                this.arrow_array.push(res[i].err_target)
            }

            this.add_task(res[i].type, res[i].title, res[i].id, res[i].style, res[i].form)
        }

    }

    save_result() {
        let el = document.querySelectorAll('.task')
        let res = []
        for (let i = 0; i < el.length; i++) {
            let r = {
                id: el[i].dataset.id,
                title: el[i].innerText,
                type: el[i].dataset.type,
                form: el[i].dataset.form,
                norm_target: this.get_from_arrow_array(el[i].dataset.id, 'n') ? this.get_from_arrow_array(el[i].dataset.id, 'n') : '',
                ok_target: this.get_from_arrow_array(el[i].dataset.id, 'o') ? this.get_from_arrow_array(el[i].dataset.id, 'o') : '',
                err_target: this.get_from_arrow_array(el[i].dataset.id, 'e') ? this.get_from_arrow_array(el[i].dataset.id, 'e') : '',
                style: {
                    top: el[i].style.top ? el[i].style.top : '0px',
                    left: el[i].style.left ? el[i].style.left : '0px'
                }
            }
            res.push(r)
        }
        document.querySelector('#result').value = JSON.stringify(res)
    }

    get_from_arrow_array(id, type) {
        let res = false
        for (let i = 0; i < this.arrow_array.length; i++)
            if (this.arrow_array[i].search(`${id}${type}`) > -1)
                res = this.arrow_array[i]
        return res
    }

}

let process = new Process()


class Modal {

    constructor() {

        this.temp_task = undefined
        this.modal_id = undefined

        this.event()
    }

    event() {

        document.querySelector('#radio_from_this_moment').addEventListener('click', (e) => {
            this.radio_switch(e)
    })

        document.querySelector('#radio_from_time').addEventListener('click', (e) => {
            this.radio_switch(e)
    })
    }

    radio_switch(e) {

        let show = e.target.dataset.show
        let hide = e.target.dataset.hide

        document.querySelector(`#${hide}`).classList.add('hide')
        document.querySelector(`#${show}`).classList.remove('hide')
    }

    open_modal(el) {
        this.temp_task = el
        console.log('open_modal')
        this.show_modal(el.dataset.type)
        if (el.dataset.form) {
            // alert('Загрузи')
            $(`${this.modal_id}`).deserialize(el.dataset.form)
        }
    }

    show_modal(title) {
        $('.modal').addClass('hide')
        $('.modal').trigger('reset')
        this.modal_id = `#modal-${title}`
        $(`${this.modal_id}`).removeClass('hide')
    }

    btn_save() {
        console.log('btn_save')
        if (this.modal_id) {
            // console.log($( `${this.modal_id}` ).serialize())
            this.temp_task.dataset.form = $(`${this.modal_id}`).serialize()
        }

    }

    btn_rm() {
        // console.log('btn_rm')
        $('.modal').addClass('hide')
        this.temp_task.remove()
    }

    btn_close() {
        $('.modal').addClass('hide')
    }

}

let modal = new Modal()

