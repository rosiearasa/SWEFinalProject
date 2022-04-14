package edu.brynmawr.cs353.thefridge;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;

import androidx.appcompat.app.AppCompatActivity;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Date;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class AddItemActivity extends AppCompatActivity {


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_item);
    }

    public void onAddItem(View v) {
        EditText typeView = (EditText) findViewById(R.id.type);
        String type = typeView.getText().toString();
        Log.v("type",type);

        EditText expDateView = (EditText) findViewById(R.id.expDate);
        String expDate = expDateView.getText().toString();
        Log.v("expDate",expDate);

        EditText noteView = (EditText) findViewById(R.id.note);
        String note = noteView.getText().toString();
        Log.v("note",note);

        addItemToDataBase(type, expDate, new Date(), note, null);
    }

    public void addItemToDataBase(String type, String expDate, Date dateAdded, String note, String userName) {

        try {
            ExecutorService executor = Executors.newSingleThreadExecutor();
            executor.execute( () -> {
                    try {
                        //create the url for /add_item
                        String end = "?type="+type+"&expDate="+expDate+"&dateAdded="+dateAdded;
                        end += String.format("&user=%s&inFridge=%d&anonymous=%b&note=%s&public=%s", null, 0, false, note, false);
                        //Log.v("url", end);

                        URL url = new URL("http://10.0.2.2:3000/add_item"+end);

                        //open the connection and send the url through
                        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                        conn.setRequestMethod("GET");
                        conn.connect();
                        url.openStream();


                        Log.v("message", "successfully added");

                    }
                    catch (Exception e) {
                        Log.v("error", e.toString());
                    }
                }
            );

            // this waits for up to 2 seconds
            // it's a bit of a hack because it's not truly asynchronous
            // but it should be okay for our purposes (and is a lot easier)
            executor.awaitTermination(2, TimeUnit.SECONDS);

            // now we can set the status in the TextView
            Log.v("message", "finished everything");
        }
        catch (Exception e) {
            // uh oh
            e.printStackTrace();
            //tv.setText(e.toString());
        }
    }
}
