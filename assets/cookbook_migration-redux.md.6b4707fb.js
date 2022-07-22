import{_ as s,o as n,c as e,a}from"./app.66459213.js";const k='{"title":"Migrating from Redux","description":"","frontmatter":{},"headers":[{"level":2,"title":"Preparation","slug":"preparation"},{"level":2,"title":"Restructuring Modules to Stores","slug":"restructuring-modules-to-stores"},{"level":2,"title":"Usage Inside Components","slug":"usage-inside-components"},{"level":2,"title":"Usage Outside Components","slug":"usage-outside-components"},{"level":2,"title":"Advanced Redux Usage","slug":"advanced-redux-usage"},{"level":3,"title":"Dynamic Modules","slug":"dynamic-modules"}],"relativePath":"cookbook/migration-redux.md"}',t={},o=a(`<h1 id="migrating-from-redux" tabindex="-1">Migrating from Redux <a class="header-anchor" href="#migrating-from-redux" aria-hidden="true">#</a></h1><p>Although the structure of Redux and React Mise stores is different, a lot of the logic can be reused. This guide serves to help you through the process and point out some common gotchas that can appear.</p><h2 id="preparation" tabindex="-1">Preparation <a class="header-anchor" href="#preparation" aria-hidden="true">#</a></h2><p>First, follow the <a href="./../getting-started.html">Getting Started guide</a> to install React Mise.</p><h2 id="restructuring-modules-to-stores" tabindex="-1">Restructuring Modules to Stores <a class="header-anchor" href="#restructuring-modules-to-stores" aria-hidden="true">#</a></h2><p>Redux has the concept of a single store with multiple <em>modules</em>. These modules can optionally be namespaced and even nested within each other.</p><p>The easiest way to transition that concept to be used with React Mise is that each module you used previously is now a <em>store</em>. Each store requires an <code>id</code> which is similar to a namespace in Redux. This means that each store is namespaced by design. Nested modules can also each become their own store. Stores that depend on each other will simply import the other store.</p><p>How you choose to restructure your Redux modules into React Mise stores is entirely up to you, but here is one suggestion:</p><div class="language-bash"><pre><code><span class="token comment"># Redux example (assuming namespaced modules)</span>
src
\u2514\u2500\u2500 store
    \u251C\u2500\u2500 index.js           <span class="token comment"># Initializes Redux, imports modules</span>
    \u2514\u2500\u2500 modules
        \u251C\u2500\u2500 module1.js     <span class="token comment"># &#39;module1&#39; namespace</span>
        \u2514\u2500\u2500 nested
            \u251C\u2500\u2500 index.js   <span class="token comment"># &#39;nested&#39; namespace, imports module2 &amp; module3</span>
            \u251C\u2500\u2500 module2.js <span class="token comment"># &#39;nested/module2&#39; namespace</span>
            \u2514\u2500\u2500 module3.js <span class="token comment"># &#39;nested/module3&#39; namespace</span>

<span class="token comment"># React Mise equivalent, note ids match previous namespaces</span>
src
\u2514\u2500\u2500 stores
    \u251C\u2500\u2500 index.js          <span class="token comment"># (Optional) Initializes React Mise, does not import stores</span>
    \u251C\u2500\u2500 module1.js        <span class="token comment"># &#39;module1&#39; id</span>
    \u251C\u2500\u2500 nested-module2.js <span class="token comment"># &#39;nested/module2&#39; id</span>
    \u251C\u2500\u2500 nested-module3.js <span class="token comment"># &#39;nested/module3&#39; id</span>
    \u2514\u2500\u2500 nested.js         <span class="token comment"># &#39;nested&#39; id</span>
</code></pre></div><p>This creates a flat structure for stores but also preserves the previous namespacing with equivalent <code>id</code>s. If you had some state/getters/actions/mutations in the root of the store (in the <code>store/index.js</code> file of Redux) you may wish to create another store called something like <code>root</code> which holds all that information.</p><p>The directory for React Mise is generally called <code>stores</code> instead of <code>store</code>. This is to emphasize that React Mise uses multiple stores, instead of a single store in Redux.</p><p>For large projects you may wish to do this conversion module by module rather than converting everything at once. You can actually mix React Mise and Redux together during the migration so this approach can also work and is another reason for naming the React Mise directory <code>stores</code> instead.</p><p>Let&#39;s break the above down into steps:</p><ol><li>Add a required <code>id</code> for the store, you may wish to keep this the same as the namespace before</li><li>Convert <code>state</code> to a function if it was not one already</li><li>Convert <code>getters</code><ol><li>Remove any getters that return state under the same name (eg. <code>firstName: (state) =&gt; state.firstName</code>), these are not necessary as you can access any state directly from the store instance</li><li>If you need to access other getters, they are on <code>this</code> instead of using the second argument. Remember that if you are using <code>this</code> then you will have to use a regular function instead of an arrow function. Also note that you will need to specify a return type because of TS limitations, see <a href="./../core-concepts/getters.html#accessing-other-getters">here</a> for more details</li><li>If using <code>rootState</code> or <code>rootGetters</code> arguments, replace them by importing the other store directly, or if they still exist in Redux then access them directly from Redux</li></ol></li><li>Convert <code>actions</code><ol><li>Remove the first <code>context</code> argument from each action. Everything should be accessible from <code>this</code> instead</li><li>If using other stores either import them directly or access them on Redux, the same as for getters</li></ol></li><li>Convert <code>mutations</code><ol><li>Mutations do not exist any more. These can be converted to <code>actions</code> instead, or you can just assign directly to the store within your components (eg. <code>userStore.firstName = &#39;First&#39;</code>)</li><li>If converting to actions, remove the first <code>state</code> argument and replace any assignments with <code>this</code> instead</li><li>A common mutation is to reset the state back to its initial state. This is built in functionality with the store&#39;s <code>$reset</code> method. Note that this functionality only exists for option stores.</li></ol></li></ol><p>As you can see most of your code can be reused. Type safety should also help you identify what needs to be changed if anything is missed.</p><h2 id="usage-inside-components" tabindex="-1">Usage Inside Components <a class="header-anchor" href="#usage-inside-components" aria-hidden="true">#</a></h2><p>Now that your Redux module has been converted to a React Mise store, any component or other file that uses that module needs to be updated too.</p><p>If you were using <code>map</code> helpers from Redux before, it&#39;s worth looking at the most of those helpers can be reused.</p><p>If you were using <code>useStore</code> then instead import the new store directly and access the state on it. For example:</p><div class="language-ts"><pre><code><span class="token comment">// Redux</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> defineComponent<span class="token punctuation">,</span> computed <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;vue&quot;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> useStore <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;Redux&quot;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token function">setup</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> store <span class="token operator">=</span> <span class="token function">useStore</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

    <span class="token keyword">const</span> firstName <span class="token operator">=</span> <span class="token function">computed</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> store<span class="token punctuation">.</span>state<span class="token punctuation">.</span>auth<span class="token punctuation">.</span>user<span class="token punctuation">.</span>firstName<span class="token punctuation">)</span>
    <span class="token keyword">const</span> fullName <span class="token operator">=</span> <span class="token function">computed</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> store<span class="token punctuation">.</span>getters<span class="token punctuation">[</span><span class="token string">&quot;auth/user/fullName&quot;</span><span class="token punctuation">]</span><span class="token punctuation">)</span>

    <span class="token keyword">return</span> <span class="token punctuation">{</span>
      firstName<span class="token punctuation">,</span>
      fullName
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre></div><div class="language-ts"><pre><code><span class="token comment">// React Mise</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> defineComponent<span class="token punctuation">,</span> computed <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;vue&quot;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> useAuthUserStore <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;@/stores/auth-user&quot;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token function">setup</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> authUserStore <span class="token operator">=</span> <span class="token function">useAuthUserStore</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

    <span class="token keyword">const</span> firstName <span class="token operator">=</span> <span class="token function">computed</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> authUserStore<span class="token punctuation">.</span>firstName<span class="token punctuation">)</span>
    <span class="token keyword">const</span> fullName <span class="token operator">=</span> <span class="token function">computed</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> authUserStore<span class="token punctuation">.</span>fullName<span class="token punctuation">)</span>

    <span class="token keyword">return</span> <span class="token punctuation">{</span>
      <span class="token comment">// you can also access the whole store in your component by returning it</span>
      authUserStore<span class="token punctuation">,</span>
      firstName<span class="token punctuation">,</span>
      fullName
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre></div><h2 id="usage-outside-components" tabindex="-1">Usage Outside Components <a class="header-anchor" href="#usage-outside-components" aria-hidden="true">#</a></h2><p>Updating usage outside of components should be simple as long as you&#39;re careful to <em>not use a store outside of functions</em>. Here is an example of using the store in a Vue Router navigation guard:</p><div class="language-ts"><pre><code><span class="token comment">// Redux</span>
<span class="token keyword">import</span> ReduxStore <span class="token keyword">from</span> <span class="token string">&quot;@/store&quot;</span>

router<span class="token punctuation">.</span><span class="token function">beforeEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>to<span class="token punctuation">,</span> from<span class="token punctuation">,</span> next<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>ReduxStore<span class="token punctuation">.</span>getters<span class="token punctuation">[</span><span class="token string">&quot;auth/user/loggedIn&quot;</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token keyword">else</span> <span class="token function">next</span><span class="token punctuation">(</span><span class="token string">&quot;/login&quot;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre></div><div class="language-ts"><pre><code><span class="token comment">// React Mise</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> useAuthUserStore <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;@/stores/auth-user&quot;</span>

<span class="token comment">// Must be used within the function!</span>
<span class="token keyword">const</span> authUserStore <span class="token operator">=</span> <span class="token function">useAuthUserStore</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span>
router<span class="token punctuation">.</span><span class="token function">beforeEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>to<span class="token punctuation">,</span> from<span class="token punctuation">,</span> next<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>authUserStore<span class="token punctuation">.</span>loggedIn<span class="token punctuation">)</span> <span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token keyword">else</span> <span class="token function">next</span><span class="token punctuation">(</span><span class="token string">&quot;/login&quot;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre></div><p>More details can be found <a href="./../core-concepts/outside-component-usage.html">here</a>.</p><h2 id="advanced-redux-usage" tabindex="-1">Advanced Redux Usage <a class="header-anchor" href="#advanced-redux-usage" aria-hidden="true">#</a></h2><p>In the case your Redux store using some of the more advanced features it offers, here is some guidance on how to accomplish the same in React Mise. Some of these points are already covered in <a href="./../introduction.html#comparison-with-Redux">this comparison summary</a>.</p><h3 id="dynamic-modules" tabindex="-1">Dynamic Modules <a class="header-anchor" href="#dynamic-modules" aria-hidden="true">#</a></h3><p>There is no need to dynamically register modules in React Mise. Stores are dynamic by design and are only registered when they are needed. If a store is never used, it will never be &quot;registered&quot;.</p>`,30),p=[o];function c(i,u,r,l,d,m){return n(),e("div",null,p)}var g=s(t,[["render",c]]);export{k as __pageData,g as default};