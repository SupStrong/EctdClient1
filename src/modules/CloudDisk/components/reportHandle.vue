<template>
	<div class="container-contant">
		<div data-v-f4cd0a72="" class="statistics">
  <div class="realtime-title clearfix">
    <div class="time-l">
      <!----> <span>数据看板</span> <i data-v-38337d7e="" class="ask el-tooltip"></i>
    </div>
  </div>
  <div class="realtime">
    <div class="user clearfix">
      <div class="box user-img">
        <div>
          <div>公</div>
          <div>用</div>
          <div>子</div>
          <div>体</div>
        </div>
      </div>
      <div>
        <div class="top"><img
            src="data:image/png;base64,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"
            alt=""> <span>访问人数</span> <i data-v-3656914e=""
            class="ask el-tooltip"></i></div>
        <div class="content">
          <p class="content-p">0</p> <span>
            较昨日:
            <span class="spanup"><i class="up"></i>
              0%
            </span></span> <span>
            较上周:
            <span class="spanup"><i class="up"></i>
              0%
            </span></span>
        </div>
      </div>
      <div>
        <div class="top"><img
            src="data:image/png;base64,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"
            alt=""> <span>新用户数</span> <i data-v-3656914e=""
            class="ask el-tooltip"></i></div>
        <div class="content">
          <p class="content-p">0</p> <span>
            较昨日:
            <span class="spanup"><i class="up"></i>
              0%
            </span></span> <span>
            较上周:
            <span class="spanup"><i class="up"></i>
              0%
            </span></span>
        </div>
      </div>
      <div>
        <div class="top"><img
            src="data:image/png;base64,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"
            alt=""> <span>累计用户数</span> <i data-v-3656914e=""
            class="ask el-tooltip"></i></div>
        <div class="content">
          <p>0</p>
        </div>
      </div>
    </div>
    <div class="behavior clearfix">
      <div class="box behavior-img">
        <div>
          <div>行</div>
          <div>为</div>
          <div>分</div>
          <div>析</div>
        </div>
      </div>
      <div>
        <div class="top"><img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAADV0lEQVRoQ92a3WoTQRTH/2d2bJvUCIpV0FKhfrV+tUhIQ+lNnsJnEXwEL3wE38OLQCkhhtxU0Va0RaQKVajg2qRNZ2dkkq5NmqTZmWzJMgu5yjln5rcze75mCHE+xeIEPC+DdDqFIJhAEIyDcw+MseYwUkoIEcDzDuF5B6jV6ggCH4XCQVzToKENVatpCHEFgP5dsLR3BGAPnO8hm61Z2miq2QOtr0/C96fB+cVhJtClK8RfZDI7WFjYt7FrDqS31eTkDUh52WbAyDqM/cb+/g/T7RgdSCnC27c3wfk1CBFdLzJBD0HOFYT4iaWl7yBSUUxFm1ixyJFOz0KpTBSjscsQ+ajVtlEoiEG2BwOVSikAd8DY2CBj5/q/lA0AX7C8XD9rnLOByuVLkPL2f7d7rjOOYFy7fca2kM//6SfdH6i1MnOJgQkJNBSw2W+legPpb2Z8fH7k26zfMujtd3i40eub6gbS3qxSuTsyBxBh57UiKPnI5T6f9n7dQOXyNIDrUe2OWG4X+fxO+xw6gXTQzGQe2MQZUuo1iB5ZARJtKaWeGevqOOX7H9uDbydQpTJrmwGMBEi/AZ1R5HLb4cs4AdK5Wb0+Z/yWjhU8pW7B87RnNH+IDoIg+GqueKyRSm2Gud8J0Nra/dgTTesZGirqhHZl5VPTVzRVWyXAvKEZMCmzirEXpnoDIv1LCawZ2+R8Q5ceLSBLz8aAFQW8Mh78DAVi7LmU8o2FzabHC4Ge2BRnnOiqlHLRYvC+KkT0PgB2LWweIZ9/R9CuOpV6aGqAe56uUM/tEUGwZ2y8Xv9AWF2dwtjYjKkyAVVTHRN5BWRN5JuyjcY3QrU6AyGmTJUTCcT5L12F3rPJ2xIJROQTSqXHNll1IoGkbOjMehFSek5sOcYC/Q09tUpGk+gUOFcOAjm35ZxzCs65becCq3Opj2VymsjA2kxOW/WQcfmQQKDj8sGywEsgUFuBZ1GCJw6oowTXq2TYJEkUUFeTRAMZtrESBdSzjaWhhmg0mmbrscn3bTTqEYZoBcc2QRNDA1vBlh7PZA4xyw5o1uvRnDtOaW09hw68wj3h1JFkCOXUoXHnSjlyrB9COXXxIoRy6mpMe/Bw5vLS6YjozPWy02DOXADslcMk4IrmPyGJxOwwrN6BAAAAAElFTkSuQmCC"
            alt=""> <span>打开次数</span> <i data-v-3656914e=""
            class="ask el-tooltip"></i></div>
        <div class="content">
          <p class="content-p">0</p> <span>
            较昨日:
            <span class="spanup"><i class="up"></i>
              0%
            </span></span> <span>
            较上周:
            <span class="spanup"><i class="up"></i>
              0%
            </span></span>
        </div>
      </div>
      <div>
        <div class="top"><img
            src="data:image/png;base64,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"
            alt=""> <span>访问次数</span> <i data-v-3656914e=""
            class="ask el-tooltip"></i></div>
        <div class="content">
          <p class="content-p">0</p> <span>
            较昨日:
            <span class="spanup"><i class="up"></i>
              0%
            </span></span> <span>
            较上周:
            <span class="spanup"><i class="up"></i>
              0%
            </span></span>
        </div>
      </div>
      <div>
        <div class="top"><img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAEQklEQVRoQ92aPWwURxTH/292YnPnXCSQIOJDFE5C+BAfAsscxBK6nnTpUqRzm0SRIiqqlCBBQYGpqFEiKtpDiJizdS5A4iOJQRbgSEkkIrL2HfbNzotmj4W1vXc7e3sf1q601b739v32vXnzZnYI3bzK5S1wnALy+Rw8bws8bxhSOhBC+K/RWkMpD46zAsd5g1qtDs9zUSq96ZYblNpQtZqHUtsAmPuDDu01ALyClK8wNlbr0Iav1jnQ/fsjcN09kPLDNA5s0FVqCYXCSxw9utyJ3eRAJq1GRnZB662dvNBaR4h/sbz8Z9J0tAdiJszM7IaUO6CUvZ41QYSglAyl/sbJk4sgYhtTdo6VyxL5/CiYCzZGuy5D5KJWe4ZSScXZjgeans4B+BRCDMUZ6+lzrVcBzOP06Xq797QHqlQ+gtafvCu7PfXYwrgp+0I8RbH4Xyvp1kDNyOzfNDABgYECnrSKVDSQGTPDwwcGnmatwmDSb2XlcdSY2ghkqtns7GcDKwAWmdecQcnF+Pgf66vfRqBKZQ+Aj23tDljuLxSLL8M+rAUyk2ahcDBunhFCfMHMk2Del6LdafUtGiD6nYimtNa/tv1gZp5y3UfhyXct0OzsaFwH4MNofbkfkSEhvo2FMh3F+PizwJ/3QKY3q9f3xzlKRNfBfChOrivPiR4y8zextnK5J0Hv9x7o7t3PbRpNAu6F0myOgLnYFyYQYOAEmre5GgycilU3De3ExG9+rfCFm0uAA7GKTYVqKLxTGpiy0bOVEcAkA5OBPANjVrpSPjZLjyZQgsq2aYEAv+IFQEdsq1VSIIdolJnPCCl/Vkq1bFmCKHQcIaCBYvEBwZTqXM56kBNwC8COt/n6kwZutksJAi4BmADwQgDfe8BCO/kUQEC9/pBw5852DA3ttcpTAI4QxzXz18T8wgGuNMyXaXMRcDU0yF0S4pzWeqaVSiqg1dXnhGp1L5TabguUVG4dkFFXRHRRM9+IspUKSMp/zCp0X5K+zbww5MicBuYE0Vkw74pykIEvAezc8Iz5hpTyQsPzvPCzVEBELmF6+nCSrjqqKEREwTaQFUeIc0rrpS4UBbNNtmo662PQ2rH1oMtApmteEEJ853me32SmipAQnhlDx+Oa0TBs14H8ckkLzPxVaiApeXMAAUuSqNRg5lQR8oEGnXLAawJ+NMUldYT8lBtsUZgXzD94RIvdKwqDKttA2ZHyvFJqzbZUqpTzy3a/J1YiJuZrDjAV1WKkAvIn1v62PjUS4rzW+nbvWp9+NadEi0JrM17me9ucNtdDvV8+EP2imF/HTeApUu7t8iGTC7zMLcFNlDK1SWKAMreNZaAytdFogDK3FZyw4sWV4D48j9msNx5k7ndKM/Uy9MMryJNM/ZIMoDL103htpDLyWz+AytTBiwAqU0djwhNKZg4vrZ8lM3O8bD1YZg4ARvU1m+CI5v/GZ5z7QbBnegAAAABJRU5ErkJggg=="
            alt=""> <span>跳出率</span> <i data-v-3656914e=""
            class="ask el-tooltip"></i></div>
        <div class="content">
          <p class="content-p">0</p> <span>
            较昨日:
            <span class="spanup"><i class="up"></i>
              0%
            </span></span> <span>
            较上周:
            <span class="spanup"><i class="up"></i>
              0%
            </span></span>
        </div>
      </div>
      <div>
        <div class="top"><img
            src="data:image/png;base64,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"
            alt=""> <span>次均停留时长</span> <i data-v-3656914e=""
            class="ask el-tooltip"></i></div>
        <div class="content">
          <p class="content-p">0</p> <span>
            较昨日:
            <span class="spanup"><i class="up"></i>
              0%
            </span></span> <span>
            较上周:
            <span class="spanup"><i class="up"></i>
              0%
            </span></span>
        </div>
      </div>
    </div>
    <div class="share clearfix">
      <div class="box share-img">
        <div>
          <div>分</div>
          <div>享</div>
          <div>裂</div>
          <div>变</div>
        </div>
      </div>
      <div>
        <div class="top"><img
            src="data:image/png;base64,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"
            alt=""> <span>分享人数</span> <i data-v-3656914e=""
            class="ask el-tooltip"></i></div>
        <div class="content">
          <p class="content-p">0</p> <span>
            较昨日:
            <span class="spanup"><i class="up"></i>
              0%
            </span></span> <span>
            较上周:
            <span class="spanup"><i class="up"></i>
              0%
            </span></span>
        </div>
      </div>
      <div>
        <div class="top"><img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAFQ0lEQVRoQ91aXUwcVRT+zp1ZuhSoBUOlFKqi1aVFo/Un8a3G+Gp8WdtaaDT+tMGUEJ+ML8Ynf2KU0FqtifEH6l/1RX0yJr4YTWqiiWmBSsEoFNEqmAJly86cY+7QpbvL7s6d2UXI7hvcc84939wz3/mZSyjh751Hfo3OzDk1DFVpK0SFsc6Ba0UUKb1NkoVtWC4pXHIYCQWer6myZx599/pEqdygYg0de3Ji/aU5rmOerSPHjoSxJ7aTVKp6al2VmjrwVuPFMDZSOqEBvd8xWTWV+LeJYFcX40C2rsCZrYtuHN/f1zAXxm5gQDqs5hdUYzKZrA2zoalOJBKZrqzgiaDhaAxIROhw+7ktynE2uewY65kCyCVnKVvYtv861L/lHBGJiS0jx755TuzTQ6MtLkuNidFSy1iKZnbEWkbvfZ4cP9u+gF6Nj1VGsHAjQyr8jK3kugItJFFx9ukTzfOF9ikIqHff8Aa4uEE00a6BH1nCsDDSdXzbhXzu5AWkT8a2ErG1AmaJli1hx40O5TupnID0O3NqYLR1tcMs3yno8Gvb3jKY651aBkiz2et7RretFgGYRrYmiqc+ahnOZr9lgHr3jTfJQuIaU8OrKUcV0T+7jjeNp/uQAUgnzbl52h42zyiy7oLIbgJtFoIvg+Z6GCQQgYwRUb8r7qlCD0znqapKGUhPvhmbHn34t5awFQBB3aNAvQIJBSTbcQK5IDzmB0pXFJ0fXDu6rJbTtdl0YjYWNoQU1FEAd4fVz6UnQl8Juc/62ayNVg+lar+lp9kTH7q5mEJTkfU5RBr9Ng+4PsjgDj8dXdB2n4id0XIeIN0CJKYvtvopFlpXUF8CaPCxMUXAzKIMXSWQjT7yQwxuN/ErWrt+ULceHqBSMJuC9QUgmwtuLvQyk/uJllFCj4PoYKkApRjPA9Szd+jWIM2ZBUu/Kx0CaRbIQYFMGp3QCgLSTWL3h7GfSVP1hTl3h8mxeoHCaqdSdCzFZiz0IMgdX21A2rcNVdZp6o0P1wtoqykgC+olAe4j0BkGXgRkQMDuWgBEkN+pJz6ylSD1poAUVD+AGIE6XbgnU3o5AJ2H0GfpdpnkO4AHvP+Jul2B7khfJ8KeLKIwJgXPJOg8Hdk9clOQum0JkPBelzB8BVA2KcgAQ/abPigtZ8H6VCDXpekEAqTrOzocH7klSFW9lgHpKpxei/9ym4KyTJ9kfkDL8tCkCL2XGXL4ieCe9WibIq3C3JYZcvIEgLqwJ8Rgl47sHt7pMhnXX+YnlOMRrSBteyGrRMoPUOlCbnUrBX1CXsitHCn8/yHnkULpaNuoOJ0k0D+LeUjqhbCpVLXc4jtEM+ETq28eMuXNgnKB8pCXWIOWPvlYzoL9poDvLAmMK0a+ZvAzpja90idocZoPEIm9i4hfMd3cT45AwiwHRPGPfrKpda841X8EaR/yAdJ2SNQuIjwEoBEwz23pDusZiQKNAehLrxX9QC21D1owSINXCJDfpiu5ntHgBWnBSwlI2LKJ0EDEjm4SiwGc0YJ7YWc4JFFQfQBaAepmuN8W48TlOd4bIJpgcR8Ia2vZkEQbMh1jKagXANwvwDhE9Yhy/g7jiCV0NaAOXW4XTjK4M4wdrZNzjKUXTAaNFlltELwtEOMKvZCjHptBugT8fRhAeQeN2pjpKFiDEpF2AjUXOfL9A0Qfs7g/hAHjOwoOynhhnCilju+wXm9Wdp9TNKiy+uCVComy+iSZAlVWH43TT6psPuunQJXVxYsUqLK6GpOeO8rm8lJ2Qiyb62XZwMrmAmCuEmYtXNH8D+CybCi+MA+SAAAAAElFTkSuQmCC"
            alt=""> <span>分享新增</span> <i data-v-3656914e=""
            class="ask el-tooltip"></i></div>
        <div class="content">
          <p class="content-p">0</p> <span>
            较昨日:
            <span class="spanup"><i class="up"></i>
              0%
            </span></span> <span>
            较上周:
            <span class="spanup"><i class="up"></i>
              0%
            </span></span>
        </div>
      </div>
      <div>
        <div class="top"><img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAGLklEQVRoQ91aW2wVZRD+vn+3paWA0FDlJmK5lYsEiRrBB8FoYiK+WQFRxGBELhIk6gtGJNHERMVakFsMEhGE4JuvErxGTFRUbsXSgtxUSmgDLRTO7oz5F05z2p7L7h4M5Ozj7sw38+0/O//M7E9cx+uTuUdLLrR5vQWm1DUoUUEPD75TZGismYSouHB8Glz2BO0Gcql3mXvhuc13tl8vN5gv0IYXTve83CblIq3l9NyiOHjqegljep3rUWbOzd846GIcjKRObEKfPvNP2bn2liGE2ysfB7rqKrzW8pK+J+dsGdAWBzcyIRtWl66YQYlEol8cg2F1ioqKmkuL5XTUcAxNSFW5+ulTg43n3eqLF1ovLIF0co5xVVz3zEufDT5FUsNghXJs9wp1D9Q1VvqivcOAXm8Zx/DCuKrKxmkr6eXCzkloVfWJ0iJcGSHQ4lxg/+dzA15JoPjIsp23X8pmJyuh2tn1feBjuNpEexNcdFTgoGHJ1pHnM7mTkZBdGddpr7pZyHSkZUfF80vqMq1UWkL2m9l/sHHMjQ6zTKtgw2/82MpD6b6pboRsNvtoZuPIG5UAwka2TRSLtlfWd81+3QjVzj45RK+03xYW+EbKsbjk3yVbh5xM9aETIbtptl3i2Hz3GQOOBvgggEkEKhTsTwVBbVKgCYq9oH4t0MP5vBC7T5WV6sHUzbcTobVP/VWZTwVgaKapYhGBYWEcJXhMFeuE/q4w8ulkbEWxcNsdjd1qOVubNbe3VsUBdpQDAb6txIQ4+gD2GcFyz8jpOPr9SnrVJWu/jhWqqa4bHafQdOFOFMi7APKt7VpU8Joa+TUqKVvQLt1ZFYRvQMi2AO3NF8dEBTIwEwGsAxCrbehuTz1RLgBlb1RfSvr1PGRbj4BQnMxGcADBLTFWpjmHTosRzIkafsmMFxCqmVU3IWpzZmA+BmBXKNKlimdJvgPowMyK/F3gz4sCbJvEpZ9X/UGbqs+3+eOiKFPNVBLvRdFJyiqdR4x4JUqzMSsp4lVR2R3FRp8y5wBrq+vtPjE0iqKBswPQ4VF0UgmpJppdMYPEYCOAAelxeFTgV0exQehx1lQ3DCW0IrQizXCj2BFaPsg89AV6gkCLAy5NwG+1+rlIUWWWT9SHtaVgE9fMaBgVpW4jOI/ggpBG6hTYJNAfCU3bx2QlpVwv9O23Guqy9R1XVzfcFaWqduCsVujkbBYUOEvwLYH/fRhPspD6SSCLwmBYGVuF84PqPycaGCeskgOzXYERWeSPU3WRT/07LGZK+G0GUN6hp2wU+k+GxRGIzzUz6if5wpyteBLUgbNLobekM0LFGTHObPvRh3UiKeeqM10M3oBqR3eswAWFTAuL5RjVOIS+UmjftIToL/aVe8I6kJQzyukwphOZ4BlxXlQeCosXEIoectyuYLeQU+BLhaxMZ9wI6Rnt41KLRHk2VSYjmauMGgT+jLCEgpCLnBTUqVXqlE5GSBHlE4B3vOOt07mX0GmqejdA204E9Z7dWJMh6YCPKc2K1DBLxVVwj8JfHJZQkBSipm0Ddy4gnY0Q34rKsuCdkg8b5fOZEkeSUC4yAQnFWqFsCksoSNtRN1ZDDoPyi85GzOs+/G9cmOUKfTSbA5YQJTEZxnkz08ok9YWYAZWGsISCjTVW6UNnG1RHXf1uqQJ5nDSrkveyE2INgSW5yBB6xIfODEvmqi96PF5xSucBqn54FQQnFDgF4P4oxnPJUvmyT/+7XHKpz4Pi1N6I2T6sB3BPFIMRZH8RyPwI8uhoH6xSnAYPcCoI3UKgfxTDuWQJc1YN5oh4Z3LJpj7v1ODFbcFBjDfqbAC0RxTjmWV5WYEXFf6+qHidWvAg7GIOSahmHIj3810puzKgvuKrvz8qmW5DEguQzxjLhp+B2irhvqjOXJP/2ZY+UcMsaSvtGMs+zHvQaMwUCBcCGmq+R/CwEGtV/R9ivghkHDRawOs1CqbyDhpOtWWPganQax0xwSYgGAf/FoyCVY/FJWL1co6C42e8fNyKr5tzWG+hC+53iiVVUD+8kgFQUL8kk6QK6qdx6koVzG/9JKmCOniRJFVQR2NSd4qCObzUdfsrmONlXYkVzAHAdAXLzXBE8z+4/1ko6Jqi6wAAAABJRU5ErkJggg=="
            alt=""> <span>分享次数</span> <i data-v-3656914e=""
            class="ask el-tooltip"></i></div>
        <div class="content">
          <p class="content-p">0</p> <span>
            较昨日:
            <span class="spanup"><i class="up"></i>
              0%
            </span></span> <span>
            较上周:
            <span class="spanup"><i class="up"></i>
              0%
            </span></span>
        </div>
      </div>
      <div>
        <div class="top"><img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAE30lEQVRoQ92aXWxURRTH/2fmbtnSltBGEEutsYgW8NsH44MPvuijicmmKn5CRdSISOKDvhhf9MFEakECKPiJHyEx8VFfTOTBxMQYjUC1tkYtFUpsG9qyS/fOOWaWLtnd3u2de3ebkjtJX3rPOTO/nbn/c2buEOrY3n/iz/TUjN/CUI2eQloYy3wYnVKkbDd5FvagDSlc8Bk5Bc62NHlTT35wba5ew6BaAx3YNrr8wgy3MU+3ke+l4sQTz88r1Ty+rEmNP32w/XycGEWf2EAfPXq6aTw32UHwmmsZQKWvwJ9uS68ceezjNTNx4kYGsssqO6va8/l8a5wOXX1SqdREYwOPRl2OzkAiQnseObVW+f5qw76znytAkJ1WnrDnjT3/ydpTRCQusZwG9u2r4h0fGO4yLC0uQettoxVNberuGr7nNfLDYocCvZX5pzGF2esY0hAWbDGfK9BsHg1/7Dp6dXahfhYE6t88uAIG68QK7WXQSAtDY2jHkfXnqg2nKpCdGU/nui8XmEuyrIV9kx6oNlOBQPad+fXE8IalXmbVZsEuvxs3dp0MeqfmAVk1e+fB4fVLJQCuK9sKxXOfdw1Wqt88oP7NIx0ym7vSNfBS2lFD+syOIx0jpWMoA7JJcyZLG2vNM/a9I0W3KNAdAFaDZFWhU6GzAMYY8qOw/Fx4yWtoNk81NcqJ0uRbBrTv4b+6aqkANFJtArMVwH0AVoaMdRLA1wR9yCA/HpfLVhTPfnrN8LxaztZmE7np7jiB7YxohS0gehxAY8QYWYh8aBiH485Ya7p5oFj7XZqhvszADXEKTYJuVsAbArkrIkiZOYG+Z+BlgZmOGscWtDuPdv9m/QpAdguQmzi/IWogC0PAIUDWRfUNtqchAbbGgUq3Lj9ptx4FoDjKZpeZp9Xbtc5MJZidKd/wC1GXX1HxCkB9Dw3cHHVzpoR6QbTdbWboX0CucrO1aij7meQ9Z3vr4vn5nZ91/0JWqs/NmE1RnOfU7CsnASAahcgzAKy9a8sS9P1R1W9Fkz5O/ZnBVQLqdO3J2imolwD0hPoQjYrwNjYY05p+CLUvN/iCwW9G8SHI39SXGeokzCU+B++CRGv6JjTPzMEI5LRiItLqQFB4EWkHsCbg2aQxcm+Ud0lAZ2lvz9D1keo2UbcpwrsLspfAhP1GRGo7CXqD7FjwFIh/CotRfG7rO9qTGbopSlWtRPeCpLoYRIAp5I0FgCC0n8k4i4Otwml35vdbFZR2/RWU6FdA8kCgfUQYB6AvmczrrmNjsKG9PYO3G6bQrXgxqILaDeDuoE4IJEJwOswo+pOABFKt/2MMftEVSCuRugIB4hPCDzJKByiAh4t/8xvhOxbeFQmorktOsI+JD7sOAPA6CXyQgCsCfYSiL7m6ikIkoBAYSxhHFOoq285ADjAAYsl2nRPrGQB2V1rWSKz88JaL/3SDARAvsS5q6TOHRSBjYO6MAGM945U+i16cFjZdFogyCwpA+aTGL05tnMXePtj8xJD/qqpZ5RqtZftgYyVug5e4LXhh2SXpkMQCJe4Yy0Il6qDRAiXuKDiu4rkXo/W1DD2sL9SDSfucYqES9cGruCgS9UmyCJWoj8alM5WYz/pFqERdvChCJepqTGn2SMzlpcqUmJjrZZVgibkAGFTEXA5XNP8H9iY6KKDzdK4AAAAASUVORK5CYII="
            alt=""> <span>回流量</span> <i data-v-3656914e=""
            class="ask el-tooltip"></i></div>
        <div class="content">
          <p class="content-p">0</p> <span>
            较昨日:
            <span class="spanup"><i class="up"></i>
              0%
            </span></span> <span>
            较上周:
            <span class="spanup"><i class="up"></i>
              0%
            </span></span>
        </div>
      </div>
    </div>
  </div>
</div>
	</div>
</template>

<script>
export default {
	name: 'disabledHandle',
	props: {
		item: {
			type: Object,
		},
	},
	data() {
		return {}
	},
};
</script>

<style lang="scss" scoped>
    .container-contant{
      background-color: #f8f8f8;
    }
    .statistics {
      width: 100%;
      padding: 0px 20px 20px 10px;
    }

    .statistics .tag {
      height: 50px;
      line-height: 50px;
      text-align: center;
      border-radius: 0;
      position: relative !important;
      color: #d2d3d6;
      background-color: #37435c;
      display: block;
      font-size: 14px
    }

    .statistics .tag>span {
      background: #fff;
      color: #4b566d;
      padding: 2px 12px;
      margin-left: 10px;
      border-radius: 10px
    }

    .statistics .tag>span:hover {
      cursor: pointer
    }

    .statistics .realtime-title {
      height: 40px;
      line-height: 40px;
      display: flex;
      margin: 0px 0 5px
    }

    .statistics .realtime-title .time-l {
      color: #16233d;
      height: 40px;
      line-height: 40px;
      font-size: 18px;
      font-weight: 700
    }

    .statistics .realtime-title .time-r {
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      margin-left: 30px;
      color: #7f8595
    }

    .statistics .realtime-title .time-r .time-a {
      color: #316eff
    }

    .statistics .realtime-title .time-r .time-a:hover {
      cursor: pointer
    }

    .statistics .realtime-title .time-r .time-b {
      color: #316eff
    }

    .statistics .realtime-title .time-r .time-b:hover {
      cursor: pointer
    }

    .statistics .realtime .behavior,
    .statistics .realtime .share,
    .statistics .realtime .user {
      height: 127px;
      margin-bottom: 20px
    }

    .statistics .realtime .behavior>div,
    .statistics .realtime .share>div,
    .statistics .realtime .user>div {
      width: 21%;
      height: 127px;
      background: #fff;
      border-radius: 4px;
      float: left;
      margin-right: 2.5%
    }

    .statistics .realtime .behavior .top,
    .statistics .realtime .share .top,
    .statistics .realtime .user .top {
      text-align: left;
      width: 100%;
      height: 47px;
      line-height: 47px;
      padding: 0 16px;
      border-bottom: 1px solid #f5f7f9;
      display: flex;
    align-items: center;
    }

    .statistics .realtime .behavior .top>img,
    .statistics .realtime .share .top>img,
    .statistics .realtime .user .top>img {
      width: 26px;
      margin:inherit;
    }

    .statistics .realtime .behavior .top>span,
    .statistics .realtime .share .top>span,
    .statistics .realtime .user .top>span {
      vertical-align: middle;
      margin-left: 5px;
    }

    .statistics .realtime .behavior .box,
    .statistics .realtime .share .box,
    .statistics .realtime .user .box {
      width: 6%;
      height: 127px;
      color: #fff;
      text-align: center;
      border-radius: 4px;
      position: relative;
      margin-right: 2.5%
    }

    .statistics .realtime .behavior .box>div,
    .statistics .realtime .share .box>div,
    .statistics .realtime .user .box>div {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column
    }

    .statistics .realtime .behavior .content,
    .statistics .realtime .share .content,
    .statistics .realtime .user .content {
      padding-left: 14px;
      text-align: left
    }

    .statistics .realtime .behavior .content>p,
    .statistics .realtime .share .content>p,
    .statistics .realtime .user .content>p {
      padding: 0;
      margin-bottom: 5px;
      text-align: left;
      font-weight: 600;
      font-size: 30px;
      color: #333;
      height: 48px;
      font-family: Bebas;
      margin-top: 0;
    }

    .statistics .realtime .behavior .content>span,
    .statistics .realtime .share .content>span,
    .statistics .realtime .user .content>span {
      font-size: 12px
    }

    .statistics .realtime .behavior .content>span .spanup,
    .statistics .realtime .share .content>span .spanup,
    .statistics .realtime .user .content>span .spanup {
      color: #05cb94
    }

    .statistics .realtime .behavior .content>span .spanunder,
    .statistics .realtime .share .content>span .spanunder,
    .statistics .realtime .user .content>span .spanunder {
      color: #f4202f
    }

    .statistics .realtime .behavior .content>span>span,
    .statistics .realtime .share .content>span>span,
    .statistics .realtime .user .content>span>span {
      padding-left: 16px;
      position: relative
    }

    .statistics .realtime .behavior .content>span>span>i,
    .statistics .realtime .share .content>span>span>i,
    .statistics .realtime .user .content>span>span>i {
      position: absolute;
      top: 1px;
      left: 2px;
      display: inline-block
    }

    .statistics .realtime .behavior .content>span>span .under,
    .statistics .realtime .share .content>span>span .under,
    .statistics .realtime .user .content>span>span .under {
      width: 10px;
      height: 13px;
      // background: url(" + i(a(730)) + ") no-repeat 50%;
      background-size: cover
    }

    .statistics .realtime .behavior .content>span>span .up,
    .statistics .realtime .share .content>span>span .up,
    .statistics .realtime .user .content>span>span .up {
      width: 10px;
      height: 13px;
      // background: url(" + i(a(731)) + ") no-repeat 50%;
      background-size: cover
    }

    .statistics .realtime .behavior :last-child,
    .statistics .realtime .share :last-child,
    .statistics .realtime .user :last-child {
      margin-right: 0
    }

    .statistics .realtime .user-img {
      background-image: url('https://tongji.aldwx.com/publice/static/img/behavior-img.9e4c4b7.png')!important;
    background-size: cover!important;
    }

    .statistics .realtime .behavior-img {
      background-image: url('https://tongji.aldwx.com/publice/static/img/behavior-img.9e4c4b7.png')!important;
      background-size: cover!important;
    }

    .statistics .realtime .share-img {
      background-image: url('https://tongji.aldwx.com/publice/static/img/behavior-img.9e4c4b7.png')!important;
      background-size: cover!important;
    }

    .statistics .tendency {
      margin-top: 25px;
      width: 100%;
      background: #fff;
      height: 470px;
      padding: 20px 0 0
    }

    .statistics .tendency .title {
      text-align: left;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      font-weight: 700;
      padding: 0 20px;
      color: #16233d
    }

    .statistics .tendency .title>img {
      width: 26px
    }

    .statistics .tendency .tendency-select {
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #e8eaec;
      padding: 0 20px
    }

    .statistics .tendency .tendency-select .se-l {
      height: 100%;
      float: left
    }

    .statistics .tendency .tendency-select .se-r {
      height: 100%;
      float: right
    }

    .statistics .tendency .tendency-select .se-r span {
      margin-left: 10px;
      color: #7f8595;
      display: inline-block;
      height: 30px;
      width: 78px;
      line-height: 30px;
      background: #f5f7fa;
      border-radius: 2px
    }

    .statistics .tendency .tendency-select .se-r span:hover {
      cursor: pointer
    }

    .statistics .tendency .tendency-select .se-r .active {
      color: #fff;
      background: #316eff
    }

    .statistics .source {
      text-align: left;
      height: 40px;
      line-height: 40px;
      font-size: 18px;
      font-weight: 700;
      color: #16233d;
      margin: 10px 0 5px
    }

    .statistics .bar {
      width: 100%;
      height: 430px
    }

    .statistics .bar .bg-purple {
      height: 430px;
      background: #fff !important
    }

    .statistics .bar .bg-purple-light,
    .statistics .bar .bg-purple {
      padding: 10px 0
    }

    .statistics .bar .bg-purple-light .title,
    .statistics .bar .bg-purple .title {
      text-align: left;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      font-weight: 700;
      padding: 0 20px;
      color: #16233d
    }

    .statistics .bar .bg-purple-light .title>img,
    .statistics .bar .bg-purple .title>img {
      width: 26px
    }

    .statistics .bar .bg-purple-light .title .more,
    .statistics .bar .bg-purple .title .more {
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      font-weight: 400;
      color: #7f8595;
      float: right
    }

    .statistics .bar .bg-purple-light .title .more>span,
    .statistics .bar .bg-purple .title .more>span {
      vertical-align: middle;
    }

    .statistics .bar .bg-purple-light .title .more>img,
    .statistics .bar .bg-purple .title .more>img {
      width: 16px
    }

    .statistics .bar .bg-purple-light .title .more:hover,
    .statistics .bar .bg-purple .title .more:hover {
      cursor: pointer
    }

    .statistics .bar .bg-purple-light {
      height: 430px;
      background: #fff !important
    }

    .statistics .dayMess {
      position: relative
    }

    .statistics .hid {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 6;
      display: flex;
      justify-content: center;
      align-items: center
    }

    .statistics .hid>div {
      position: relative
    }

    .statistics .hid img {
      width: 190px
    }

    .statistics .hid p {
      position: absolute;
      top: 90px;
      left: 90px;
      transform: translate(-50%, -50%);
      color: #7f8595
    }

    .statistics #dayLine {
      width: 100%;
      height: 360px !important
    }

    .statistics #active,
    .statistics #newly {
      width: 100%;
      height: 390px !important
    }
</style>
