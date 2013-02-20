@Grapes([
@Grab(group='org.jsoup', module='jsoup', version='1.7.2'),
@Grab(group='commons-lang', module='commons-lang', version='2.4')
])
import org.apache.commons.lang.StringEscapeUtils
//String url = "http://localhost:8080/uppercut/crawl?eventName="
String name = "Marionettejs is Just Freaking AweSome"
//String host = "dev.chicago.com.local:3001"
String path = "/slab"
String host = "www.dev.chicago.com.local:3001"
//String path = "/simple-slab/slab"
//String path = "/uppercut/crawl"
java.net.URI _url = new java.net.URI("http", host, path, "eventName=${name}", null)
println "uri.toString(): ${_url.toString()}"
org.jsoup.nodes.Document doc = org.jsoup.Jsoup.connect(_url.toURL().toString()).get()
org.jsoup.select.Elements landscapeEl = doc.select('#480x208')
println "\n\nlandscape: " + landscapeEl
println landscapeEl.first()
org.jsoup.select.Elements portriatEl = doc.select('#320x356')
println "\n\nportrait: "
println portriatEl.first()

/*
org.jsoup.select.Elements bodyEl = doc.select('html')
println "\nbody: " + bodyEl.first()
*/
