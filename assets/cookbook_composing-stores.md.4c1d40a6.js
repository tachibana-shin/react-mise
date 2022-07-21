import{_ as n,o as s,c as a,a as t}from"./app.94b42f56.js";const h='{"title":"Composing Stores","description":"","frontmatter":{},"headers":[{"level":2,"title":"Nested stores","slug":"nested-stores"},{"level":2,"title":"Shared Getters","slug":"shared-getters"},{"level":2,"title":"Shared Actions","slug":"shared-actions"}],"relativePath":"cookbook/composing-stores.md"}',p={},o=t(`<h1 id="composing-stores" tabindex="-1">Composing Stores <a class="header-anchor" href="#composing-stores" aria-hidden="true">#</a></h1><p>Composing stores is about having stores that use each other and there is one rule to follow:</p><p>If <strong>two or more stores use each other</strong>, they cannot create an infinite loop through <em>getters</em> or <em>actions</em>. They cannot <strong>both</strong> directly read each other state in their setup function:</p><div class="language-js"><pre><code><span class="token keyword">const</span> useX <span class="token operator">=</span> <span class="token function">defineStore</span><span class="token punctuation">(</span><span class="token string">&quot;x&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> y <span class="token operator">=</span> <span class="token function">useY</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

  <span class="token comment">// \u274C This is not possible because y also tries to read x.name</span>
  y<span class="token punctuation">.</span>name

  <span class="token keyword">function</span> <span class="token function">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// \u2705 Read y properties in computed or actions</span>
    <span class="token keyword">const</span> yName <span class="token operator">=</span> y<span class="token punctuation">.</span>name
    <span class="token comment">// ...</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">return</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token function">ref</span><span class="token punctuation">(</span><span class="token string">&quot;I am X&quot;</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token keyword">const</span> useY <span class="token operator">=</span> <span class="token function">defineStore</span><span class="token punctuation">(</span><span class="token string">&quot;y&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> x <span class="token operator">=</span> <span class="token function">useX</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

  <span class="token comment">// \u274C This is not possible because x also tries to read y.name</span>
  x<span class="token punctuation">.</span>name

  <span class="token keyword">function</span> <span class="token function">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// \u2705 Read x properties in computed or actions</span>
    <span class="token keyword">const</span> xName <span class="token operator">=</span> x<span class="token punctuation">.</span>name
    <span class="token comment">// ...</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">return</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token function">ref</span><span class="token punctuation">(</span><span class="token string">&quot;I am Y&quot;</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre></div><h2 id="nested-stores" tabindex="-1">Nested stores <a class="header-anchor" href="#nested-stores" aria-hidden="true">#</a></h2><p>Note that if one store uses another store, <strong>there is no need to create a new store in a separate file</strong>, you can directly import it. Think of it as nesting.</p><p>You can call <code>useOtherStore()</code> at the top of any getter or action:</p><div class="language-js"><pre><code><span class="token keyword">import</span> <span class="token punctuation">{</span> useUserStore <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./user&quot;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> cartStore <span class="token operator">=</span> <span class="token function">defineStore</span><span class="token punctuation">(</span><span class="token string">&quot;cart&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">getters</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token comment">// ... other getters</span>
    <span class="token function">summary</span><span class="token punctuation">(</span><span class="token parameter">state</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> user <span class="token operator">=</span> <span class="token function">useUserStore</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

      <span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">Hi </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>user<span class="token punctuation">.</span>name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">, you have </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>state<span class="token punctuation">.</span>list<span class="token punctuation">.</span>length<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> items in your cart. It costs </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>state<span class="token punctuation">.</span>price<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.</span><span class="token template-punctuation string">\`</span></span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>

  <span class="token literal-property property">actions</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token function">purchase</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> user <span class="token operator">=</span> <span class="token function">useUserStore</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

      <span class="token keyword">return</span> <span class="token function">apiPurchase</span><span class="token punctuation">(</span>user<span class="token punctuation">.</span>id<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>list<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre></div><h2 id="shared-getters" tabindex="-1">Shared Getters <a class="header-anchor" href="#shared-getters" aria-hidden="true">#</a></h2><p>You can simply call <code>useOtherStore()</code> inside a <em>getter</em>:</p><div class="language-js"><pre><code><span class="token keyword">import</span> <span class="token punctuation">{</span> defineStore <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-mise&quot;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> useUserStore <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./user&quot;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> useCartStore <span class="token operator">=</span> <span class="token function">defineStore</span><span class="token punctuation">(</span><span class="token string">&quot;cart&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">getters</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token function">summary</span><span class="token punctuation">(</span><span class="token parameter">state</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> user <span class="token operator">=</span> <span class="token function">useUserStore</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

      <span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">Hi </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>user<span class="token punctuation">.</span>name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">, you have </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>state<span class="token punctuation">.</span>list<span class="token punctuation">.</span>length<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> items in your cart. It costs </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>state<span class="token punctuation">.</span>price<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.</span><span class="token template-punctuation string">\`</span></span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre></div><h2 id="shared-actions" tabindex="-1">Shared Actions <a class="header-anchor" href="#shared-actions" aria-hidden="true">#</a></h2><p>The same applies to <em>actions</em>:</p><div class="language-js"><pre><code><span class="token keyword">import</span> <span class="token punctuation">{</span> defineStore <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-mise&quot;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> useUserStore <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./user&quot;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> useCartStore <span class="token operator">=</span> <span class="token function">defineStore</span><span class="token punctuation">(</span><span class="token string">&quot;cart&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">actions</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token keyword">async</span> <span class="token function">orderCart</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> user <span class="token operator">=</span> <span class="token function">useUserStore</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

      <span class="token keyword">try</span> <span class="token punctuation">{</span>
        <span class="token keyword">await</span> <span class="token function">apiOrderCart</span><span class="token punctuation">(</span>user<span class="token punctuation">.</span>token<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>items<span class="token punctuation">)</span>
        <span class="token comment">// another action</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">emptyCart</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">displayError</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre></div>`,14),e=[o];function c(u,r,i,l,k,d){return s(),a("div",null,e)}var y=n(p,[["render",c]]);export{h as __pageData,y as default};
