let items = document.querySelectorAll('.carousel .carousel-item')

items.forEach((el) => {
    const minPerSlide = 3
    let next = el.nextElementSibling
    for (var i=1; i<minPerSlide; i++) {
        if (!next) {
            // wrap carousel by using first child
        	next = items[0]
      	}
        let cloneChild = next.cloneNode(true)
        el.appendChild(cloneChild.children[0])
        next = next.nextElementSibling
    }
})

/* Nothing below this point is needed. */
const darkSwitch = document.getElementById("darkSwitch");
window.addEventListener("load", function () {
    if (darkSwitch) {
        initTheme();
        darkSwitch.addEventListener("change", function () {
            resetTheme();
        });
    }
});

function initTheme() {
    let darkThemeSelected =
        localStorage.getItem("darkSwitch") !== null &&
        localStorage.getItem("darkSwitch") === "dark";
    darkSwitch.checked = darkThemeSelected;
    darkThemeSelected
        ? document.documentElement.setAttribute('data-bs-theme', 'dark')
    : document.documentElement.removeAttribute("data-bs-theme");
}

function resetTheme() {
    if (darkSwitch.checked) {
        document.documentElement.setAttribute("data-bs-theme", "dark");
        localStorage.setItem("darkSwitch", "dark");
    } else {
        document.documentElement.removeAttribute("data-bs-theme");
        localStorage.removeItem("darkSwitch");
    }
}
